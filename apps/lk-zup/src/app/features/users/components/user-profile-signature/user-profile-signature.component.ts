import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ProviderErrorsEnum } from '@features/users/models/provider-errors.enum';
import { Environment } from '@shared/classes/ennvironment/environment';
import { ItemListInterface } from '@shared/components/item-list/models/item-list.interface';
import { SignatureProviderInterface } from '@shared/features/signature-validation-form/models/providers.interface';
import { StepInterface } from '@shared/interfaces/steps/step.interface';
import { AppService } from '@shared/services/app.service';

@Component({
    selector: 'app-user-profile-signature',
    templateUrl: './user-profile-signature.component.html',
    styleUrls: ['./user-profile-signature.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class UserProfileSignatureComponent implements OnChanges {
  app = inject(AppService);

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  apiUrl = Environment.inv().api;

  certs: ItemListInterface[] = [];

  @Input() provider: SignatureProviderInterface;

  @Output() openForm = new EventEmitter<SignatureProviderInterface>();

  steps: StepInterface[] = [
    {
      id: 'doc-sign',
      active: false,
      title: 'Подписание документа',
      description:
        'Проверьте и подпишите документ для выпуска подписи. Он появится в личном кабинете в течение нескольких минут.', // Check and sign the document for signature release. It will appear in your personal account within a few minutes.
      icon: 'pi pi-file',
    },
    {
      id: 'sms',
      active: false,
      title: 'СМС',
      description:
        'После подписания документа дождитесь СМС для подтверждения. Это может занять несколько минут.', // After signing the document, wait for SMS for confirmation. This may take a few minutes.
      icon: 'pi pi-envelope',
    },
    {
      id: 'complete',
      active: false,
      title: 'Выполнено',
      description: 'Сертификат УНЭП успешно выпущен.',
      icon: 'pi pi-check',
    },
  ];

  private readonly certKeys = {
    serialNumber: 'PROFILE_SERIAL_NUMBER',
    dateBegin: 'PROFILE_DATE_CREATION',
    dateEnd: 'PROFILE_DATE_END',
    commonName: 'PROFILE_OWNER_ATTRIBUTES',
    revocationTime: 'PROFILE_DATE_REVOCATION',
    // assignment: 'PROFILE_ASSIGNMENT',
    requestStatus: 'SIGNATURE_REQUEST_STATUS',
    requestStatusDescription: 'SIGNATURE_REQUEST_STATUS_DESCRIPTION',
  };

  private readonly dateKeys = ['dateBegin', 'dateEnd', 'revocationTime'];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.provider?.currentValue && this.provider.ui.certs) {
      this.filterCerts();
      this.checkCertInProgress();
      this.initCertSteps();
    }
  }

  /**
   * Отфильтровываем сертификаты провайдера ЭЦП, оставляя только имеющиеся и те, что ещё в процессе выпуска.
   */
  filterCerts(): void {
    this.provider.ui.certs = this.provider.ui.certs.filter(
      (c) => c.requestStatus || c.serialNumber
    );
  }

  /**
   * Проверяем, есть ли хоть один сертификат в процессе выпуска (при наличии такового отключаем кнопку выпуска подписи).
   */
  checkCertInProgress(): void {
    this.provider.ui.hasCertInProgress = this.provider.ui.certs.some(
      (c) => c.requestStatus
    );
  }

  initCertSteps(): void {
    for (const cert of this.provider.ui.certs) {
      cert.steps = this.steps.map((step: StepInterface, index: number) => {
        if (step.id === 'doc-sign') {
          step.active = cert.requestStatus === 'Новый';
        }

        if (step.id === 'sms') {
          step.active = cert.requestStatus === 'Ожидает подтверждения';

          if (cert.requestStatus === 'В обработке') {
            step.active = true;
            step.title = 'В обработке';
            step.icon = 'pi pi-hourglass';
            step.description =
              'Ожидайте завершения текущей операции. Это может занять некоторое время.';
          }

          if (cert.requestStatus === 'Ошибка при обработке') {
            step.active = true;
            step.title = 'Ошибка';
            step.icon = 'pi pi-exclamation-circle';
            step.description =
              'При обработке возникла ошибка. Обратитесь к администратору (или сотруднику, предоставившему вам доступ в личный кабинет).';
          }
        }

        if (step.id === 'complete') {
          step.active = !!cert.serialNumber;
        }

        return step;
      });
    }
  }

  openCreationForm(): void {
    this.openForm.emit(this.provider);
  }

  private isDate(key: string): boolean {
    return this.dateKeys.includes(key);
  }

  protected readonly ProviderErrorsEnum = ProviderErrorsEnum;
}
