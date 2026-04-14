import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { AuthSsoSaml2Facade } from '@features/auth/facades/auth-sso-saml2.facade';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { FileBase64 } from '@shared/models/files.interface';
import { AppService } from '@shared/services/app.service';
import { FilesService } from '@shared/services/files.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import mime from 'mime';
import { firstValueFrom, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  standalone: false,
})
export class AuthComponent implements OnInit {
  app: AppService = inject(AppService);

  fileService: FilesService = inject(FilesService);

  authSsoSaml2Facade: AuthSsoSaml2Facade = inject(AuthSsoSaml2Facade);

  activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  screenSizeData = this.app.storage.screen.data.frontend.size;

  settings: WritableSignal<SettingsInterface> = this.app.settingsSignal;

  authTypes = computed(() => {
    const type = this.settings().general.authType;
    if (Array.isArray(type)) {
      return type;
    } else {
      return [type];
    }
  });

  isSsoOnly = computed(
    () => this.authTypes().length === 1 && this.authTypes()[0] === 'sso',
  );

  settings$: Observable<SettingsInterface> = toObservable(this.settings).pipe(
    filter((v) => !!v),
    take(1),
  );

  isMobileV = this.screenSizeData.signal.isMobileV;

  currentAuthType = signal('');

  hasCustomLogo = computed(
    () => !this.settings() || !!this.settings()?.general?.mainLogo,
  );

  customLogoUrl: WritableSignal<string | null> = signal(null);

  constructor(private localStorageService: LocalStorageService) {
    effect(() => {
      const types = this.authTypes();

      if (!types) {
        return;
      }

      if (types.includes('login')) {
        this.currentAuthType.set('login');
      } else if (types.includes('sms')) {
        this.currentAuthType.set('sms');
      }
    });
  }

  ngOnInit(): void {
    this.addSubscriptions();
    console.log('this.auth', this.app.settingsSignal());
  }

  addSubscriptions(): void {
    this.addSettingsSubscription();
  }

  addSettingsSubscription(): void {
    this.settings$.subscribe(async () => {
      // украдено из auth-sso-saml2-container.component.ts (хз, будет ли это работать вообще ^_^)
      if (this.settings()?.general?.authType === 'sso') {
        const hasError: boolean =
          this.activatedRoute.snapshot.queryParams.hasError === 'true';

        if (!hasError && this.settings()?.general?.skipLoginButton) {
          this.ssoAuth();
        }
      }

      await this.mainLogoHandler();
    });
  }

  async mainLogoHandler(): Promise<void> {
    const { settings } = this.app;
    if (!settings) return;

    // const apiURL: string = this.app.env.api;
    const apiPathToFile: string = settings?.general?.mainLogo;

    const fileID: string = apiPathToFile?.split('/')?.reverse()?.[0];
    if (!fileID) return;

    let file: FileBase64;
    file = (await firstValueFrom(
      this.fileService.getFile('file', 'general', fileID, true),
    )) as FileBase64;
    if (!file) return;

    const imageMimeType: string = mime.getType(file.fileExtension);
    if (!imageMimeType) return;

    const image64: string = file.file64;

    if (!image64) return;

    const imageDataURL: string = `data:${imageMimeType};base64,${image64}`;
    this.customLogoUrl.set(imageDataURL);
  }

  ssoAuth(): void {
    this.localStorageService.setAuthType('sso');
    this.authSsoSaml2Facade.authnRequest(
      this.activatedRoute.snapshot.queryParams.issuerUrl ||
        document.location.href,
    );
  }
}
