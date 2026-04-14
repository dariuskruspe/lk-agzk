import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ItemListInterface } from '@shared/components/item-list/models/item-list.interface';
import {
  FpcInputsInterface,
  FpcInterface,
} from '@wafpc/base/models/fpc.interface';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LangFacade } from '../../../lang/facades/lang.facade';
import { LangUtils } from '../../../lang/utils/lang.utils';
import { SignatureValidationFormInterfaces } from '../../../signature-validation-form/models/signature-validation-form.interfaces';
import { AbstractCreationComponent } from '../abstract-creation/abstract-creation.component';

@Component({
    selector: 'app-password-creation',
    templateUrl: './password-creation.component.html',
    styleUrls: ['./password-creation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class PasswordCreationComponent
  extends AbstractCreationComponent
  implements OnInit
{
  personalData: ItemListInterface[] = [];

  template: FpcInputsInterface[] = [
    {
      type: 'password',
      formControlName: 'password',
      label: this.langUtils.convert(this.langFacade.getLang(), 'PASSWORD_NEW'),
      placeholder: '',
      gridClasses: ['col-12'],
      validations: ['required'],
      icon: { name: 'clear', clearMode: true },
      edited: true,
    },
    {
      type: 'password',
      formControlName: 'confirmPassword',
      label: this.langUtils.convert(
        this.langFacade.getLang(),
        'PASSWORD_CONFIRM'
      ),
      placeholder: '',
      gridClasses: ['col-12'],
      validations: ['required'],
      icon: { name: 'clear', clearMode: true },
      edited: true,
    },
  ];

  fpcConfig: FpcInterface = {
    options: {
      changeStrategy: 'push',
      appearanceElements: 'outline',
      editMode: true,
      viewMode: 'edit',
    },
    template: this.template,
  };

  nextStepClickedSignal: WritableSignal<boolean> = signal(false);

  nextStepClicked$: Observable<boolean> = toObservable(
    this.nextStepClickedSignal
  ).pipe(takeUntil(this.destroy$));

  submitForm$ = new Subject<void>();

  constructor(private langUtils: LangUtils, private langFacade: LangFacade) {
    super();
  }

  ngOnInit(): void {
    this.addSubscriptions();
  }

  addSubscriptions(): void {
    this.addNextStepClickedSubscription();
  }

  addNextStepClickedSubscription(): void {
    this.nextStepClicked$.subscribe((v) => {
      if (!v) return;
      this.skipPasswordSetupIfNeed();
    });
  }

  skipPasswordSetupIfNeed(): void {
    // (чисто для подстраховки, т. к. аналогичная проверка осуществляется в signature-creation.ts)
    // если для текущего провайдера ЭЦП при выпуске электронной подписи не требуется установка (задание) пароля, то
    // не выводим форму создания пароля, а сразу отправляем запрос на выпуск
    if (!this.provider?.ui?.requirePasswordSetup) {
      const params = {
        signInfo: {
          provider: this.provider?.metadata?.id,
        },
      };
      this.submit(params);
    }
  }

  validate(form: { password: string; confirmPassword: string }): void {
    const params = this.convertFormToParams(form);
    if (this.comparePasswords(form.password, form.confirmPassword)) {
      this.submit(params);
    }
  }

  private convertFormToParams(form: {
    password: string;
    confirmPassword: string;
  }): { signInfo: SignatureValidationFormInterfaces } {
    return {
      signInfo: {
        provider: this.provider.metadata?.id,
        password: form.password,
      },
    };
  }

  private comparePasswords(password: string, confirmation: string): boolean {
    return password === confirmation;
  }
}
