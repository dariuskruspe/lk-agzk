import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Type,
} from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, SubscriptionLike, of } from 'rxjs';
import { switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { SignableFacade } from '../../../../classes/abstractions/signable.facade';
import { SignatureResponseInterface } from '../../../../models/signature-response.interface';
import { CustomDialogService } from '../../../../services/dialog.service';
import { hasSecondStep } from '../../../signature-creation-form/models/creation-signature-response.interface';
import { AbstractValidationComponent } from '../../components/abstract-validation/abstract-validation.component';
import { AdditionalMessageComponent } from '../../components/additional-message/additional-message.component';
import { ProvidersChoiceComponent } from '../../components/providers-choice/providers-choice.component';
import { ERROR } from '../../constants/error';
import { SignatureValidation } from '../../constants/signature-validation';
import { ProvidersFacade } from '../../facades/providers.facade';
import { SignatureProviderInterface } from '../../models/providers.interface';
import { SignatureInfoInterface } from '../../models/signature-info.interface';
import { SignatureValidationFormInterfaces } from '../../models/signature-validation-form.interfaces';
import { Order } from '../../models/signature-validation-order.interface';
import {
  ProvidersAlias,
  SignatureValidationType,
} from '../../models/signature-validation-type.interface';
import { filterSuccessOnly } from '../../utils/filter-success-only.util';

@Component({
    selector: 'app-signature-validation-form-container',
    templateUrl: './signature-validation-form-container.component.html',
    styleUrls: ['./signature-validation-form-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: DialogService,
            useClass: CustomDialogService,
        },
    ],
    standalone: false
})
export class SignatureValidationContainerComponent
  implements OnDestroy, AfterViewInit
{
  destroy$ = new Subject<void>();

  @Input() providersInfo: SignatureInfoInterface[];

  private providers: SignatureProviderInterface[] | null = null;

  @Input() signatureEnable = true;

  @Input() facade: SignableFacade<unknown>;

  @Input() fileInfo: { fileID: string; fileOwner: string; file64?: string };

  @Input() body: any = {};

  @Output() validate = new EventEmitter<
    SignatureResponseInterface | typeof ERROR
  >();

  private submit$ = new Subject<
    SignatureValidationFormInterfaces | typeof ERROR
  >();

  private dialogRef: DynamicDialogRef;

  private sub: SubscriptionLike;

  constructor(
    private providersFacade: ProvidersFacade,
    private dialog: DialogService
  ) {}

  ngAfterViewInit(): void {
    this.defineProvider();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  private defineProvider(): void {
    const signProviders = this.providersFacade.getData()?.signProviders ?? [];
    this.providers =
      (this.providersInfo ?? [])
        .map((item) => {
          return {
            ...signProviders?.find(
              (provider) => item.id === provider.metadata?.id
            ),
            link: item?.link,
          };
        })
        .filter((provider) => !!provider?.metadata?.id) ?? [];

    if (this.providers && this.providers.length > 1) {
      this.dialogRef = this.dialog.open(ProvidersChoiceComponent, {
        closable: true,
        dismissableMask: true,
        data: {
          providers: this.providers,
          forEmployee: this.body?.forEmployee,
        },
      });
      this.dialogRef.onClose
        .pipe(take(1), takeUntil(this.destroy$))
        .subscribe((provider: SignatureProviderInterface | undefined) => {
          if (provider) {
            this.initSignMethod(provider);
          } else {
            this.validate.emit();
          }
        });
    } else {
      this.initSignMethod(this.providers[0]);
    }
  }

  private initSignMethod(provider?: SignatureProviderInterface): void {
    const signatureValidation =
      SignatureValidation[
        provider?.metadata?.confirmMethod ?? ProvidersAlias.createNew
      ];

    let res: SignatureResponseInterface | typeof ERROR;
    let req$: Observable<SignatureResponseInterface | typeof ERROR> = of({});
    if (this.sub) {
      this.sub.unsubscribe();
    }

    switch (signatureValidation.order) {
      case Order.before:
        this.sub = this.openComponentDialog({
          type: signatureValidation?.type,
          provider,
          fileInfo: this.fileInfo,
          forEmployee: this.body?.forEmployee,
        })
          .pipe(
            tap((data) => {
              if (data) {
                const sig = data?.signInfo?.sig
                  ? {
                      signInfo: { sig: data.signInfo.sig },
                    }
                  : {};

                const globalSignInfo = { ...data?.signInfo };
                delete globalSignInfo.sig;

                this.facade.sendForSignature({
                  files: [
                    {
                      fileID: this.body?.fileID,
                      owner: this.body?.fileOwner,
                      taskId: this.body?.taskId,
                      ...sig,
                    },
                  ],
                  forEmployee: this.body?.forEmployee,
                  signInfo: { ...globalSignInfo },
                  currentRole: this.body?.currentRole,
                });
                req$ = this.facade.getSignatureResponse$();
              }
            }),
            switchMap(() => req$),
            takeUntil(this.destroy$)
          )
          .subscribe((result) => {
            if (result === ERROR) {
              this.submit$.next(ERROR);
              return;
            }

            if (this.dialogRef) {
              this.dialogRef.close(result);
            }

            this.validate.emit(result);
            if (hasSecondStep(result)) {
              this.openComponentDialog({
                type: AdditionalMessageComponent,
                provider,
                response: result,
              });
            }
          });
        break;
      case Order.after:
        this.facade.sendForSignature({
          files: [
            {
              fileID: this.body?.fileID,
              owner: this.body?.fileOwner,
              taskId: this.body?.taskId,
            },
          ],
          forEmployee: this.body?.forEmployee,
          signInfo: {
            provider: provider?.metadata?.id,
          },
          currentRole: this.body?.currentRole,
        });
        req$ = this.facade.getSignatureResponse$().pipe(take(1));

        this.sub = req$
          .pipe(
            switchMap((response) => {
              res = response;
              const confirmMethod: SignatureValidationType =
                provider?.metadata?.confirmMethod;

              if (res !== ERROR) {
                /**
                 * Условие, при котором не отображаем диалог о подписании/выпуске подписи при нажатии на кнопку
                 * "Подписать".
                 */
                const dontShowSignDialog: boolean =
                  confirmMethod === ProvidersAlias.confirmByOtherApp ||
                  ((confirmMethod === ProvidersAlias.smsSigningOnly ||
                    confirmMethod === ProvidersAlias.sms ||
                    confirmMethod === ProvidersAlias.emailSigningIssueRelease ||
                    confirmMethod === ProvidersAlias.smsSigningIssueRelease) &&
                    !res.displayConfirmationCodeWindow);

                /**
                 * Условие, при котором не отображаем диалог о подписании/выпуске подписи при нажатии на кнопку
                 * "Подписать" (за ненадобностью, либо по причине того, что он появится автоматически при поступлении
                 * соответствующего уведомления [как в случае SMS-подписания]).
                 */
                // const dontShowSignDialog: boolean =
                //   confirmMethod === ProvidersAlias.confirmByOtherApp ||
                //   confirmMethod === ProvidersAlias.smsSigningOnly ||
                //   confirmMethod === ProvidersAlias.sms ||
                //   confirmMethod === ProvidersAlias.smsSigningIssueRelease;

                if (dontShowSignDialog) {
                  return of(res);
                }

                return this.openComponentDialog({
                  type: signatureValidation.type,
                  provider,
                  response,
                  fileInfo: this.body,
                  forEmployee: this.body?.forEmployee,
                });
              }
              return of(ERROR);
            }),
            tap((response) => {
              this.validate.emit(
                response as typeof ERROR | SignatureResponseInterface
              );
              if (this.dialogRef) {
                this.dialogRef.close(res);
              }
            }),
            takeUntil(this.destroy$)
          )
          .subscribe();
        break;
      case Order.none:
        this.openComponentDialog({
          type: signatureValidation.type,
          provider,
          forEmployee: this.body?.forEmployee,
        });
        break;
      default:
        break;
    }
  }

  private openComponentDialog(data: {
    type: Type<AbstractValidationComponent>;
    provider: SignatureProviderInterface;
    response?: SignatureResponseInterface | typeof ERROR;
    fileInfo?: { fileID: string; fileOwner: string; file64?: string };
    forEmployee?: boolean;
  }): Observable<{ signInfo?: SignatureValidationFormInterfaces }> {
    if (!data.type) {
      return of({});
    }

    this.dialogRef = this.dialog.open(data.type, {
      closable: true,
      dismissableMask: true,
      data: {
        response: data.response,
        provider: data.provider,
        forEmployee: data.forEmployee,
        fileInfo: data.fileInfo,
        submit$: this.submit$,
        signatureEnable: this.signatureEnable,
      },
    });

    this.dialogRef.onClose
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((result) => {
        this.validate.emit(result);
      });

    return this.submit$
      .asObservable()
      .pipe(filterSuccessOnly(), takeUntil(this.destroy$)) as Observable<{
      signInfo?: SignatureValidationFormInterfaces;
    }>;
  }
}
