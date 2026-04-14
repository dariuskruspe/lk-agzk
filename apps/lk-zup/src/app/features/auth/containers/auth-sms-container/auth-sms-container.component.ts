import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthLoginFacade } from '@features/auth/facades/auth-login.facade';
import { GetCodeResponseInterface } from '@features/auth/models/auth-sms-interface';
import { AuthSmsService } from '@features/auth/services/auth-sms.service';
import { firstValueFrom } from 'rxjs';
import { LocalStorageService } from '@shared/services/local-storage.service';

@Component({
    selector: 'app-auth-sms-container',
    templateUrl: './auth-sms-container.component.html',
    styleUrls: ['./auth-sms-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AuthSmsContainerComponent {
  constructor(
    public authLoginFacade: AuthLoginFacade,
    public authSmsService: AuthSmsService,
    private localStorageService: LocalStorageService
  ) {}

  submitLoginForm(data: FormGroup): void {
    this.localStorageService.setAuthType('sms');
    const authData = {
      login: this.phoneNumberReplacer(data.value.phoneNumber),
      pass: data.value.code,
    };
    this.authLoginFacade.authorizationReq(authData);
  }

  async getSMSCode(phoneNumber: string): Promise<GetCodeResponseInterface> {
    const res: GetCodeResponseInterface = await firstValueFrom(
      this.authSmsService.getCode(this.phoneNumberReplacer(phoneNumber))
    );

    // для теста
    // const res = { success: true };

    this.authSmsService.getCodeResponseSignal.set(res);

    return res;
  }

  phoneNumberReplacer(phoneNumber: string): string {
    return phoneNumber.replace(/[^\w]/g, '').replace('8', '7');
  }
}
