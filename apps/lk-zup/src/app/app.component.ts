import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Inject,
  isDevMode,
  OnDestroy,
  OnInit,
  Optional,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import {
  ActivationStart,
  NavigationEnd,
  Params,
  Router,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { PageStorageInterface } from '@shared/interfaces/storage/page/page-storage.interface';
import { FileBase64 } from '@shared/models/files.interface';
import { UserSettingsInterface } from '@shared/models/menu-condition.interface';
import { AppService } from '@shared/services/app.service';
import { FilesService } from '@shared/services/files.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import mime from 'mime';
import { DialogService } from 'primeng/dynamicdialog';
import { firstValueFrom, Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import Version from '../version/version.json';
import { Environment } from './shared/classes/ennvironment/environment';
import { ContactContainerComponent } from './shared/features/contact/containers/contact-container/contact-container.component';
import { TranslatePipe } from './shared/features/lang/pipes/lang.pipe';
import { SettingsFacade } from './shared/features/settings/facades/settings.facade';
import {
  BOOTSTRAP_PARAMS,
  BootstrapParamsInterface,
} from './shared/models/bootstrap-params.interface';
import { injectResource } from './shared/services/api-resource/utils';
import { FileBase64Resource } from './shared/api-resources/file.resource';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TranslatePipe],
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  app: AppService = inject(AppService);

  destroyRef: DestroyRef = inject(DestroyRef);

  currentPageStorage: PageStorageInterface = this.app.storage.page.current;

  urlSignal: WritableSignal<string> =
    this.currentPageStorage.data.frontend.signal.url;

  urlSegmentsSignal: WritableSignal<UrlSegment[]> =
    this.currentPageStorage.data.frontend.signal.urlSegments;

  urlQueryParamsSignal: WritableSignal<Params> =
    this.currentPageStorage.data.frontend.signal.urlQueryParams;

  urlFragmentSignal: WritableSignal<string> =
    this.currentPageStorage.data.frontend.signal.urlFragmentSignal;

  settingsSignal: WritableSignal<SettingsInterface> =
    this.app.storage.settings.data.frontend.signal.globalSettings;

  settings$: Observable<SettingsInterface> = toObservable(
    this.settingsSignal,
  ).pipe(
    filter((v: SettingsInterface) => !!v),
    takeUntilDestroyed(this.destroyRef),
  );

  userSettingsSignal: WritableSignal<UserSettingsInterface> =
    this.app.userSettingsSignal;

  userSettings$: Observable<UserSettingsInterface> = toObservable(
    this.userSettingsSignal,
  ).pipe(
    filter((v: UserSettingsInterface) => !!v),
    takeUntilDestroyed(this.destroyRef),
  );

  private fileBase64Resource = injectResource(FileBase64Resource);

  title = 'lk-zup';

  // Версия приложения
  private ver = Version;

  /**
   * Глобальная подписка, содержащая внутри себя другие подписки (добавляемые с помощью метода add), чтобы можно было
   * отписаться от них одним действием — вызовом метода unsubscribe.
   */
  private subscription: Subscription = new Subscription();

  constructor(
    // Angular
    private router: Router,

    // Other
    private fileService: FilesService,
    private titleService: Title,
    public settingsFacade: SettingsFacade,
    private translatePipe: TranslatePipe,
    private localStorageService: LocalStorageService,
    @Optional()
    @Inject(BOOTSTRAP_PARAMS)
    public bootstrapParams: BootstrapParamsInterface,
    private dialogService: DialogService,
  ) {}

  async ngOnInit(): Promise<void> {
    // await this.app.globalSettingsHandler();
    // TODO: заменить на строчку 'await this.app.globalSettingsHandler();' (для этого нужно везде, где используется получение настроек через gerx, переделать на получение настроек из хранилища в AppService, и при сохранении настроек пользователем обновлять значение сигнала, содержащего глобальные настройки в хранилище)
    this.settingsFacade.getData$().subscribe((settings) => {
      this.app.setGlobalSettings(settings);
    });
    this.settingsFacade.showSettings();
    this.addSettingsSubscription();

    this.currentURLHandler();
    this.handleBootstrapParams(this.bootstrapParams);
    this.dropCache();
    const appTitle = this.titleService.getTitle();
    this.router.events
      .pipe(
        filter((event) => event instanceof ActivationStart),
        map((child: ActivationStart) => {
          if (
            child &&
            child.snapshot &&
            child.snapshot.data &&
            child.snapshot.data.title
          ) {
            return child.snapshot.data.title;
          }
          return appTitle;
        }),
      )
      .subscribe((ttl: string) => {
        this.titleService.setTitle(
          `${this.translatePipe.transform(ttl)}
          ${ttl ? ' - ' : ''} ${this.translatePipe.transform(
            Environment.inv().title,
          )}`,
        );
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addSettingsSubscription(): void {
    this.settings$.subscribe(async () => {
      await this.faviconHandler();
    });
  }

  private async faviconHandler(): Promise<void> {
    const { settings } = this.app;

    // test
    // settings.general.favicon = '/assets/icons/test-favicon.ico';
    this.settingsSignal.set(settings);

    if (settings?.general?.favicon) {
      // const apiURL: string = this.app.env.api;
      const apiPathToFile: string = settings?.general?.favicon;

      const fileID: string = apiPathToFile?.split('/')?.reverse()?.[0];
      if (!fileID) return;

      const file = await this.fileBase64Resource({
        fileType: 'file',
        fileOwner: 'general',
        filePath: fileID,
      });

      if (!file) return;

      const imageMimeType: string = mime.getType(file.fileExtension);
      if (!imageMimeType) return;

      const image64: string = file.file64;
      if (!image64) return;

      const imageDataURL: string = `data:${imageMimeType};base64,${image64}`;
      this.setFavicon(imageDataURL);
    }
  }

  private setFavicon(faviconURL: string): void {
    let faviconElement: HTMLLinkElement =
      document.querySelector<HTMLLinkElement>('link[rel*="icon"]');
    if (!faviconElement) {
      faviconElement = document.createElement('link');
      faviconElement.rel = 'icon';
      document.head.appendChild(faviconElement);
    }
    faviconElement.href = faviconURL;
  }

  currentURLHandler(): void {
    const routerEventsSubscription: Subscription = this.router.events.subscribe(
      (value) => {
        if (value instanceof NavigationEnd) {
          const { url } = this.router;
          this.urlSignal.set(url);

          const urlTree: UrlTree = this.router.parseUrl(url);

          console.groupCollapsed('URL');
          console.log(`url:`, url);
          console.log(`urlTree:`, urlTree);
          console.groupEnd();

          const urlSegments: UrlSegment[] =
            urlTree?.root?.children?.primary?.segments || [];

          this.urlSegmentsSignal.set(urlSegments);

          this.urlQueryParamsSignal.set(urlTree?.queryParams || {});

          this.urlFragmentSignal.set(urlTree?.fragment || null);
        }
      },
    );
    this.subscription.add(routerEventsSubscription);
  }

  checkVersion(): boolean {
    return (
      this.localStorageService.getVersion() ===
      `${this.ver.version}-${this.ver.type}`
    );
  }

  dropCache(): void {
    if (!this.checkVersion()) {
      if (window?.navigator?.serviceWorker) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister().then();
          }
        });
      }
      this.localStorageService.setVersion();
      window.location.reload.bind(window.location);
    }
  }

  contactMe(): void {
    this.dialogService.open(ContactContainerComponent, {
      closable: true,
      dismissableMask: true,
      header: this.translatePipe.transform('CONTACT_TITLE'),
    });
  }

  private handleBootstrapParams(params?: BootstrapParamsInterface): void {
    if (params?.authLink) {
      const token = params.authLink.split('/auth/ml?t=')?.[1];
      if (token) {
        this.router.navigate(['auth', 'ml'], {
          queryParams: {
            t: token,
          },
        });
      }
    }
  }

  protected readonly isDevMode = isDevMode;
}
