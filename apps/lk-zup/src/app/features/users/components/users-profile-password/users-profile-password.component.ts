import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Observable } from 'rxjs';
import { CustomValidator } from '../../../../shared/classes/custon-validator/custom-validator';
import { LangFacade } from '../../../../shared/features/lang/facades/lang.facade';
import { LangUtils } from '../../../../shared/features/lang/utils/lang.utils';
import {
  Preloader,
  providePreloader,
} from '../../../../shared/services/preloader.service';

@Component({
    selector: 'app-users-profile-password',
    templateUrl: './users-profile-password.component.html',
    styleUrls: ['./users-profile-password.component.scss'],
    providers: providePreloader(ProgressSpinner),
    standalone: false
})
export class UsersProfilePasswordComponent implements OnInit, OnChanges {
  changePassForm: FormGroup;

  showPassword: {
    oldPass?: boolean;
    newPass?: boolean;
    confirmPass?: boolean;
  } = {};

  @Input() loading: boolean;

  @Input() loading$: Observable<boolean>;

  @Input() result: { success: boolean };

  @Output() submitChangePassForm = new EventEmitter();

  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    public langUtils: LangUtils,
    public langFacade: LangFacade,
    private preloader: Preloader
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.changePassForm && changes?.result?.currentValue?.success) {
      setTimeout(() => this.formGroupDirective.resetForm(), 0);
    }
    if (this.loading$ !== null) {
      this.preloader.setCondition(this.loading$);
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.changePassForm = this.fb.group({
      oldPass: ['', [Validators.required]],
      newPass: [''],
      confirmPass: [''],
    });
    this.changePassForm.get('confirmPass').setValidators([
      Validators.required,
      CustomValidator.matchValidator(this.changePassForm.get('newPass'), {
        hasMatch: true,
      }),
    ]);
    this.changePassForm.get('newPass').setValidators([
      Validators.required,
      CustomValidator.hasDifferenceValidator(
        this.changePassForm.get('oldPass'),
        {
          hasDifference: true,
        }
      ),
      CustomValidator.patternValidator(/\d/, { hasNumber: true }),
      CustomValidator.patternValidator(/^\S*$/, { hasSpace: true }),
      CustomValidator.patternValidator(/[A-Z]/, {
        hasCapitalCase: true,
      }),
      CustomValidator.patternValidator(/[a-z]/, { hasSmallCase: true }),
      CustomValidator.patternValidator(/[!@#$%^&*()_+\-=\[\]{};':"|,.<>/?]/, {
        hasSpecialCharacters: true,
      }),
      CustomValidator.antiPatternValidator(
        /[^a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"|,.<>/?]/,
        {
          hasUnacceptableSymbols: true,
        }
      ),
      Validators.minLength(8),
      Validators.maxLength(20),
    ]);
  }

  onSubmit(): void {
    if (this.changePassForm.valid) {
      this.submitChangePassForm.emit(this.changePassForm.value);
    }
  }
}
