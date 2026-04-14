import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { SignatureProviderInterface } from '@shared/features/signature-validation-form/models/providers.interface';
import { ProvidersAlias } from '@shared/features/signature-validation-form/models/signature-validation-type.interface';

@Component({
    selector: 'app-sms-validation',
    templateUrl: './sms-validation.component.html',
    styleUrls: ['./sms-validation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SmsValidationComponent {
  @Input() loading = false;

  @Input() provider: SignatureProviderInterface;

  @Output() submitCode = new EventEmitter<string>();

  /**
   * Значение, введённое пользователем в поле ввода SMS-кода.
   */
  smsCode: string;

  /**
   * Маска поля ввода SMS-кода.
   */
  mask: string = '******';

  /**
   * Минимальное количество символов в поле ввода SMS-кода.
   */
  minLength: number | null = 4;

  /**
   * Максимальное количество символов в поле ввода SMS-кода.
   */
  maxLength: number | null = 20;

  /**
   * Текст-заполнитель (placeholder) для поля ввода SMS-кода.
   */
  smsCodePlaceholder: string = '123456';

  /**
   * Объект валидации для поля ввода SMS-кода.
   */
  smsCodeValidation: { errors: any[] } = { errors: [] };

  ngOnInit() {
    this.initSMSCodeInput();
  }

  /**
   * Инициализируем поле ввода SMS-кода.
   */
  private initSMSCodeInput() {
    // Контур УНЭП (с помощью СМС)
    if (
      this.provider?.metadata?.id === '27c39060-22e2-11ed-838b-704d7b29a748'
    ) {
      this.minLength = 6;
      this.maxLength = 6;
    }
  }

  /**
   * Валидация поля ввода SMS-кода
   * @param smsCode значение, введённое пользователем в поле ввода SMS-кода
   */
  validateSMSCode(smsCode: string | null): void {
    const errors: any[] = [];

    switch (this.provider?.metadata?.id) {
      // Контур УНЭП (с помощью СМС)
      case '27c39060-22e2-11ed-838b-704d7b29a748':
        if (smsCode?.length < this.minLength) {
          errors.push({ name: 'minLength' });
        }

        if (smsCode?.length > this.maxLength) {
          errors.push({ name: 'maxLength' });
        }

        this.smsCodeValidation.errors = errors;
        break;
    }
  }

  /**
   * Отправить введённое пользователем в поле ввода SMS-кода значение (обработчик нажатия на кнопку "Подтвердить").
   */
  submitSMSCode() {
    this.submitCode.emit(this.smsCode);
  }

  /**
   * Метод для старого поля ввода SMS-кода (с FPC).
   * @param form
   */
  validate(form: { sms: string }): void {
    if (form.sms) {
      this.submitCode.emit(form.sms);
    }
  }

    protected readonly ProvidersAlias = ProvidersAlias;
}
