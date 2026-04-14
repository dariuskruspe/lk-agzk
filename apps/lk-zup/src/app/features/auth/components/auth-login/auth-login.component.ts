import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthLoginService } from '../../services/auth-login.service';

@Component({
    selector: 'app-auth-login',
    templateUrl: './auth-login.component.html',
    styleUrls: ['./auth-login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AuthLoginComponent {
  authForm: FormGroup;

  @Input() loading$;

  @Output() submitLoginForm = new EventEmitter();

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private fb: FormBuilder,
    private authApi: AuthLoginService,
  ) {
    this.matIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `./assets/img/svg/sprite.svg`,
      ),
    );
    this.initForm();
  }

  initForm(): void {
    this.authForm = this.fb.group({
      login: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.authForm.valid) {
      this.submitLoginForm.emit(this.authForm.value);
    } else {
      this.authApi.showErrors(this.authForm);
    }
  }

  get login(): AbstractControl {
    return this.authForm.get('login');
  }

  get password(): AbstractControl {
    return this.authForm.get('pass');
  }
}
