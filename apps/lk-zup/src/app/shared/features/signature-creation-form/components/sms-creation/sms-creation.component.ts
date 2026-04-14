import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { SignatureProviderInterface } from '@shared/features/signature-validation-form/models/providers.interface';
import { logDebug } from '@shared/utilits/logger';
import {
  FpcInputsInterface,
  FpcInterface,
} from '@wafpc/base/models/fpc.interface';
import { Subject } from 'rxjs';
import { ProvidersAlias } from '@shared/features/signature-validation-form/models/signature-validation-type.interface';

@Component({
    selector: 'app-sms-creation',
    templateUrl: './sms-creation.component.html',
    styleUrls: ['./sms-creation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SmsCreationComponent implements OnInit {
  @Input() loading = false;

  @Input() provider: SignatureProviderInterface;

  @Output() submitCode = new EventEmitter<string>();

  // FPC fields

  template: FpcInputsInterface[];

  fpcConfig: FpcInterface;

  submitForm$ = new Subject<void>();

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
    // this.initFPC();
    this.initSMSCodeInput();
  }

  /**
   * Инициализируем поле ввода SMS-кода.
   */
  private initSMSCodeInput() {
    // HRM-39527
    // Контур УНЭП (с помощью СМС)
    logDebug(`this.provider!!!`, this.provider);
    if (
      this.provider?.metadata?.id === '27c39060-22e2-11ed-838b-704d7b29a748'
    ) {
      this.minLength = 6;
      this.maxLength = 6;
    }
  }

  /**
   * Инициализируем поля ввода из самописной библиотеки полей ввода (FPC — Form Page Constructor), использующей под капотом primeNG.
   */
  initFPC() {
    const smsFPCInput: FpcInputsInterface = {
      type: 'text',
      formControlName: 'sms',
      gridClasses: ['col-12'],
      validations: ['required'],
      icon: { name: 'clear', clearMode: true },
      edited: true,
    };

    // HRM-39527
    // Контур УНЭП (с помощью СМС)
    if (
      this.provider?.metadata?.id === '27c39060-22e2-11ed-838b-704d7b29a748'
    ) {
      // !!! если ввести больше 6 символов — выдаётся некорректное сообщение валидации о том, что символов должно быть не более 20
      smsFPCInput.validations = ['required', { maxLength: 6 }];
    }

    this.template = [smsFPCInput];

    this.fpcConfig = {
      options: {
        changeStrategy: 'push',
        appearanceElements: 'outline',
        editMode: true,
        viewMode: 'edit',
      },
      template: this.template,
    };
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
