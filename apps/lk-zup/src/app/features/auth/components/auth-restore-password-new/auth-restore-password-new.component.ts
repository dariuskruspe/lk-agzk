import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../../../../shared/classes/custon-validator/custom-validator';

@Component({
    selector: 'app-auth-restore-password-new',
    templateUrl: './auth-restore-password-new.component.html',
    styleUrls: ['./auth-restore-password-new.component.scss'],
    standalone: false
})
export class AuthRestorePasswordNewComponent implements OnInit {
  setPassForm: FormGroup;

  showPassword: boolean;

  @Input() userData: string;

  @Input() loading;

  @Output() setPass = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.setPassForm = this.fb.group({
      newPass: [
        '',
        [
          Validators.required,
          CustomValidator.patternValidator(/\d/, { hasNumber: true }),
          CustomValidator.patternValidator(/^\S*$/, { hasSpace: true }),
          CustomValidator.patternValidator(/[A-Z]/, {
            hasCapitalCase: true,
          }),
          CustomValidator.patternValidator(/[a-z]/, { hasSmallCase: true }),
          CustomValidator.patternValidator(
            /[!@#$%^&*()_+\-=\[\]{};':"|,.<>/?]/,
            {
              hasSpecialCharacters: true,
            }
          ),
          CustomValidator.antiPatternValidator(
            /[^a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"|,.<>/?]/,
            {
              hasUnacceptableSymbols: true,
            }
          ),
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
      userData: [this.userData, [Validators.required]],
    });
  }

  togglePass(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.setPassForm.valid) {
      this.setPass.emit(this.setPassForm.value);
    }
  }
}
