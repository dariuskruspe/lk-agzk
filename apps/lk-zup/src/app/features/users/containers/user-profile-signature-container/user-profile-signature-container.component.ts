import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ProgressBar } from 'primeng/progressbar';
import { Subject, timer } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
// eslint-disable-next-line max-len
import { DocumentStateFacade } from '@features/agreements/facades/document-state-facade.service';
import { DocumentListFacade } from '@features/agreements/facades/document-list-facade.service';
import { UserTextDialogComponent } from '@features/users/components/user-text-dialog/user-text-dialog.component';
import { SignatureCreationFormContainerComponent } from '../../../../shared/features/signature-creation-form/containers/signature-creation-form-container/signature-creation-form-container.component';
import { ProvidersFacade } from '../../../../shared/features/signature-validation-form/facades/providers.facade';
import { SignatureProviderInterface } from '../../../../shared/features/signature-validation-form/models/providers.interface';
import { CustomDialogService } from '../../../../shared/services/dialog.service';
import {
  Preloader,
  providePreloader,
} from '../../../../shared/services/preloader.service';
import { MainCurrentUserFacade } from '../../../main/facades/main-current-user.facade';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '../../../main/utils/breadcrumb-provider.utils';

@Component({
    selector: 'app-user-profile-signature-container',
    templateUrl: './user-profile-signature-container.component.html',
    styleUrls: ['./user-profile-signature-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideBreadcrumb('ELECTRONIC_SIGNATURE', 0),
        {
            provide: DialogService,
            useClass: CustomDialogService,
        },
        providePreloader(ProgressBar),
    ],
    standalone: false
})
export class UserProfileSignatureContainerComponent
  implements OnInit, OnDestroy
{
  private destroy$ = new Subject<void>();

  readonly providers = this.providersFacade.getData$().pipe(
    map((v) => {
      return v.signProviders
        .filter((p) => p.ui.show)
        .sort(this.providersCompareFn);
    })
  );

  constructor(
    private providersFacade: ProvidersFacade,
    public currentUserFacade: MainCurrentUserFacade,
    private dialogService: DialogService,
    public agreementDocumentStateFacade: DocumentStateFacade,
    private preloader: Preloader,
    public agreementsListFacade: DocumentListFacade,
    @Inject(BREADCRUMB) private _: unknown
  ) {
    this.preloader.setCondition(
      this.providersFacade.loading$(),
      this.currentUserFacade.loading$()
    );
  }

  ngOnInit(): void {
    this.pollCertificatesInfo();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  /**
   * Функция сравнения провайдеров ЭЦП (используется для сортировки списка провайдеров).
   */
  providersCompareFn(
    a: SignatureProviderInterface,
    b: SignatureProviderInterface
  ): number {
    // в самом верху отображаем те провайдеры ЭЦП, для которых уже есть выпущенная электронная подпись

    const hasA: boolean = a.ui.certs?.some((c) => c.serialNumber);
    const hasB: boolean = b.ui.certs?.some((c) => c.serialNumber);

    if (hasA && hasB) {
      // если у обоих выпущена, то сортируем по алфавиту
      return a.ui.name.localeCompare(b.ui.name, 'en-US');
    } else if (hasA) {
      return -1;
    } else if (hasB) {
      return 1;
    }

    // затем отображаем те провайдеры, для которых ЭЦП в процессе выпуска

    const inProgressA: boolean = a.ui.certs?.some((c) => c.requestStatus);
    const inProgressB: boolean = b.ui.certs?.some((c) => c.requestStatus);

    if (inProgressA && inProgressB) {
      // если у обоих в процессе выпуска, то сортируем по алфавиту
      return a.ui.name.localeCompare(b.ui.name, 'en-US');
    } else if (inProgressA) {
      return -1;
    } else if (inProgressB) {
      return 1;
    }

    // и, наконец, отображаем всех оставшихся провайдеров ЭЦП
    return 0;
  }

  openSignatureCreation(provider: SignatureProviderInterface): void {
    const dialog = this.dialogService.open(
      SignatureCreationFormContainerComponent,
      {
        closable: true,
        dismissableMask: true,
        data: {
          provider,
        },
      }
    );
    dialog.onClose
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((result) => {
        this.providersFacade.show();
        if (result && provider.metadata.confirmMethod === 'sms') {
          const dialogRef = this.dialogService.open(UserTextDialogComponent, {
            showHeader: false,
          });
          const unsignedState = this.agreementDocumentStateFacade
            .getData()
            .documentsStates.filter((e) => {
              return e.sign === false;
            })
            .map((e) => {
              return e.id;
            });
          this.agreementsListFacade.getDocumentList({
            state: unsignedState,
            mandatory: true,
          });
          const intervalId = setInterval(() => {
            if (this.agreementsListFacade.getData()?.count > 0) {
              dialogRef.close();
              clearInterval(intervalId);
              window.location.reload();
            }
            this.agreementsListFacade.getDocumentList({
              state: unsignedState,
              mandatory: true,
            });
          }, 10000);
        }
      });
  }

  private pollCertificatesInfo(): void {
    timer(0, 60000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.providersFacade.show();
      });
  }
}
