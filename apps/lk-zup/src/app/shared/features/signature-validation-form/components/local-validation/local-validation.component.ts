import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Inject,
  InjectionToken,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CryptoProCert } from '@shared/features/crypto-pro/shared/crypto-pro-cert';
import { AppService } from '@shared/services/app.service';
import { RememberSettingService } from '@shared/services/remember-setting.service';
import { isDev } from '@shared/utilits/is-dev';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject, of } from 'rxjs';
import {
  catchError,
  filter,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { FileOwners } from '@shared/models/files.interface';
import { TranslatePipe } from '../../../lang/pipes/lang.pipe';
import { MessageSnackbarService } from '../../../message-snackbar/message-snackbar.service';
import { MessageType } from '../../../message-snackbar/models/message-type.enum';
import { ValidationFileFacade } from '../../facades/validation-file.facade';
import { AbstractLocalValidationService } from '../../services/abstract-local-validation.service';
import { filterLocalCertificates } from '../../utils/filter-local-certificates.util';
import {
  CryptoProToken,
  PossibleTokens,
} from '../../utils/local-services.token';
import { AbstractValidationComponent } from '../abstract-validation/abstract-validation.component';

const localServiceToken = new InjectionToken<AbstractLocalValidationService>(
  'localService',
);

let dynamicToken: string = CryptoProToken;

@Component({
    selector: 'app-local-validation',
    templateUrl: './local-validation.component.html',
    styleUrls: ['./local-validation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: localServiceToken,
            useExisting: dynamicToken,
        },
    ],
    standalone: false
})
export class LocalValidationComponent
  extends AbstractValidationComponent
  implements OnInit
{
  private lastUsedSignCertificate = inject(RememberSettingService)
    .lastUsedSignCertificate;

  private readonly fileInfo: {
    fileID: string;
    fileOwner: string;
    file64?: string;
  };

  loading = new BehaviorSubject(false);

  loadingSigning = new BehaviorSubject(false);

  loadingSignal = toSignal(this.loading);

  loadingSigningSignal = toSignal(this.loadingSigning);

  certificates = signal<CryptoProCert[]>([]);

  isEmpty = computed(() => {
    const loading = this.loadingSignal();
    const loadingSigning = this.loadingSigningSignal();

    return this.certificates().length === 0 && !loading && !loadingSigning;
  });

  activeCert = signal('');

  settings = computed(() => {
    return this.app.storage.settings.data.frontend.signal.globalSettings();
  });

  constructor(
    protected config: DynamicDialogConfig,
    protected dialogRef: DynamicDialogRef,
    @Inject(localServiceToken)
    private localService: AbstractLocalValidationService,
    private fileFacade: ValidationFileFacade,
    private snackbar: MessageSnackbarService,
    private translate: TranslatePipe,
    private app: AppService,
  ) {
    super(config, dialogRef);
    this.fileInfo = this.config.data.fileInfo;

    dynamicToken =
      PossibleTokens.find((item) => item === this.provider.metadata?.app) ??
      CryptoProToken;

    config.header = this.translate.transform('LOCAL_TITLE');
    config.style = {
      'min-width': '400px',
    };
  }

  ngOnInit(): void {
    this.loading.next(true);
    this.localService
      .isServiceWorkingCorrect()
      .pipe(
        take(1),
        tap((v) => {
          if (!v) {
            this.snackbar.show(
              this.translate.transform('LOCAL_PROVIDER_ERROR'),
              MessageType.error,
            );
            this.loading.next(false);
            this.close();
          }
        }),
        filter((v) => v),
        switchMap(() => {
          return this.localService.getAllCertificates();
        }),
        catchError(() => {
          this.snackbar.show(
            this.translate.transform('LOCAL_NO_CERTIFICATES'),
            MessageType.warn,
          );
          this.close();
          return of([]);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((items: CryptoProCert[]) => {
        this.loading.next(false);
        this.certificates.set(
          filterLocalCertificates({
            certificates: items,
            providerSignType: this.provider.metadata?.signType,
            forEmployee: this.forEmployee,
            settings: this.settings(),
            isDevMode: isDev(),
          }),
        );

        if (this.certificates().length) {
          let active = this.certificates()[0];
          if (this.lastUsedSignCertificate.get()) {
            const found = this.certificates().find(
              (i) => i.thumbprint === this.lastUsedSignCertificate.get(),
            );
            if (found) {
              active = found;
            }
          }

          this.activeCert.set(active.thumbprint);
        }
      });
  }

  signByLocal(): void {
    this.loadingSigning.next(true);
    this.fileFacade.show({
      fileOwner: this.fileInfo.fileOwner as FileOwners,
      fileID: this.fileInfo.fileID,
    });
    this.fileFacade
      .getData$()
      .pipe(
        take(1),
        switchMap((doc: Blob) => {
          return doc.arrayBuffer();
        }),
        switchMap((doc: ArrayBuffer) => {
          return this.localService.sign(this.activeCert(), doc);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(
        (value) => {
          this.confirm({
            signInfo: {
              provider: this.provider.metadata.id,
              sig: value,
            },
          });

          this.submit$.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
            this.loadingSigning.next(false);
          });
          this.lastUsedSignCertificate.remember(this.activeCert());
        },
        (error) => {
          this.snackbar.show(
            error?.message ?? 'Не удалось подписать',
            MessageType.error,
          );
          this.loadingSigning.next(false);
        },
      );
  }
}
