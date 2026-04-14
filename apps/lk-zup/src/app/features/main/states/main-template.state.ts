import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '@shared/services/app.service';
import { logError } from '@shared/utilits/logger';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';
import { InitialLoadingService } from '../../../shared/services/initial-loading.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { AuthLoginService } from '../../auth/services/auth-login.service';
import { AuthSsoSaml2Service } from '../../auth/services/auth-sso-saml2.service';

@Injectable({
  providedIn: 'root',
})
export class MainTemplateState {
  public entityName = 'template';

  public geRxMethods: GeRxMethods = {
    add: {
      main: this.authLoginService.logout.bind(this.authLoginService),
      success: this.logoutUserSuccess,
      error: this.logoutUserError,
    },
    exception: {
      main: this.logoutUserSoo,
      success: this.logoutUserSooSuccess,
    },
  };

  constructor(
    private router: Router,
    private app: AppService,
    private authLoginService: AuthLoginService,
    private authSsoSaml2Service: AuthSsoSaml2Service,
    private localStorageService: LocalStorageService,
    private initialLoadingService: InitialLoadingService,
  ) {}

  logoutUserSuccess(): Observable<void | Promise<boolean>> {
    this.localStorageService.clearSettings();
    this.localStorageService.clearUserSettings();
    this.localStorageService.clearHasUnsignedDocuments();
    return of(
      this.app.redirectToLoginPage(),
      this.localStorageService.clearTokens(),
      this.localStorageService.clearAuthType(),
    );
  }

  logoutUserError(error: Error): Observable<void> {
    logError(error, 'logoutUserError');
    return of();
  }

  logoutUserSoo(userId: string): Observable<void> {
    return this.authSsoSaml2Service.logout(userId);
  }

  logoutUserSooSuccess(res: unknown): Observable<void> {
    this.localStorageService.clearSettings();
    this.localStorageService.clearUserSettings();
    this.localStorageService.clearHasUnsignedDocuments();
    return of(
      this.localStorageService.clearTokens(),
      this.localStorageService.clearAuthType(),
      this.authSsoSaml2Service.ssoRedirect(res),
    );
  }
}
