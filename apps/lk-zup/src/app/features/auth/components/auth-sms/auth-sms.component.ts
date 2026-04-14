import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  Signal,
  WritableSignal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthSmsService } from '@features/auth/services/auth-sms.service';
import { Subject } from 'rxjs';
import { GetCodeResponseInterface } from '../../models/auth-sms-interface';
import { AuthLoginService } from '../../services/auth-login.service';

@Component({
    selector: 'app-auth-sms',
    templateUrl: './auth-sms.component.html',
    styleUrls: ['./auth-sms.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AuthSmsComponent implements OnDestroy {
  phoneForm: FormGroup = this.createForm();

  getCodeResponseSignal: WritableSignal<GetCodeResponseInterface> =
    this.authSMSService.getCodeResponseSignal;

  codeSentSignal: Signal<boolean> = this.authSMSService.codeSentSignal;

  @Output() sendLoginForm = new EventEmitter();

  @Output() getSmsCode = new EventEmitter();

  private destroy$ = new Subject<void>();

  constructor(
    // Angular
    private fb: FormBuilder,

    // API
    private authApi: AuthLoginService,
    public authSMSService: AuthSmsService
  ) {}

  createForm(): FormGroup {
    return this.fb.group({
      phoneNumber: [null, [Validators.required, Validators.minLength(17)]],
      code: [null, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.phoneForm.valid) {
      this.sendLoginForm.emit(this.phoneForm);
    } else {
      this.authApi.showErrors(this.phoneForm);
    }
  }

  get phoneNumber(): AbstractControl {
    return this.phoneForm.get('phoneNumber');
  }

  getSms(): void {
    this.getSmsCode.emit(this.phoneForm.value.phoneNumber);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
