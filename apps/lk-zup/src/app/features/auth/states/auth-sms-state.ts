import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { AuthSmsService } from '../services/auth-sms.service';

@Injectable({
  providedIn: 'root',
})
export class AuthSmsState {
  public entityName = 'smsState';

  public geRxMethods: GeRxMethods = {
    add: {
      main: this.authSmsService.getCode.bind(this.authSmsService),
    },
  };

  constructor(private authSmsService: AuthSmsService) {}
}
