import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  FpcInputsInterface,
  FpcInterface,
} from '@wafpc/base/models/fpc.interface';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { LangFacade } from '../../../lang/facades/lang.facade';
import { LangUtils } from '../../../lang/utils/lang.utils';
import { SignatureValidationRememberPassFacade } from '../../facades/signature-validation-remember-pass.facade';
import { SignatureValidationFormInterfaces } from '../../models/signature-validation-form.interfaces';
import { AbstractValidationComponent } from '../abstract-validation/abstract-validation.component';

@Component({
    selector: 'app-password-validation',
    templateUrl: './password-validation.component.html',
    styleUrls: ['./password-validation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class PasswordValidationComponent
  extends AbstractValidationComponent
  implements AfterViewInit
{
  password: FpcInputsInterface = {
    type: 'password',
    formControlName: 'password',
    label: this.langUtils.convert(this.langFacade.getLang(), 'AUTH_PASSWORD'),
    placeholder: '',
    gridClasses: ['col-12'],
    validations: ['required'],
    icon: { name: 'clear', clearMode: true },
    edited: true,
  };

  checkbox: FpcInputsInterface = {
    type: 'checkbox',
    formControlName: 'remember',
    label: this.langUtils.convert(
      this.langFacade.getLang(),
      'SIGNATURE_SAVE_PASS'
    ),
    gridClasses: ['col-12'],
    validations: [],
    edited: true,
    optionList: [],
  };

  fpcConfig: FpcInterface = {
    options: {
      changeStrategy: 'push',
      appearanceElements: 'outline',
      editMode: true,
      viewMode: 'edit',
    },
    template: [this.password, this.checkbox],
  };

  submitForm$ = new Subject<void>();

  constructor(
    private passwordRememberFacade: SignatureValidationRememberPassFacade,
    private langUtils: LangUtils,
    private langFacade: LangFacade,
    protected config: DynamicDialogConfig,
    protected dialogRef: DynamicDialogRef,
    private cdr: ChangeDetectorRef
  ) {
    super(config, dialogRef);
  }

  validate(form: { password: string; remember: boolean }): void {
    const params = this.convertFormToParams(form);
    this.confirm(params);
    if (form.remember) {
      this.passwordRememberFacade.show(form.password);
    } else {
      this.passwordRememberFacade.show('');
    }
  }

  private convertFormToParams(form: { password: string; remember: boolean }): {
    signInfo: SignatureValidationFormInterfaces;
  } {
    return {
      signInfo: {
        provider: this.provider.metadata.id,
        password: form.password ?? null,
      },
    };
  }

  ngAfterViewInit(): void {
    const pass = this.passwordRememberFacade.getData();
    if (pass) {
      this.password.value = pass;
      this.checkbox.value = true;

      this.fpcConfig = {
        ...this.fpcConfig,
        template: [{ ...this.password }, { ...this.checkbox }],
      };

      this.cdr.markForCheck();
    }
  }
}
