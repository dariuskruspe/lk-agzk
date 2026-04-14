import { Component } from '@angular/core';
import { AuthLoginFacade } from '../../facades/auth-login.facade';
import { AuthLoginInterface } from '../../models/auth-login.interface';
import { LocalStorageService } from '@shared/services/local-storage.service';

@Component({
    selector: 'app-auth-login-container',
    templateUrl: './auth-login-container.component.html',
    styleUrls: ['./auth-login-container.component.scss'],
    standalone: false
})
export class AuthLoginContainerComponent {
  constructor(public authLoginFacade: AuthLoginFacade, private localStorageService: LocalStorageService) {}

  submitLoginForm(data: AuthLoginInterface): void {
    this.localStorageService.setAuthType('login');
    this.authLoginFacade.authorizationReq(data);
  }
}
