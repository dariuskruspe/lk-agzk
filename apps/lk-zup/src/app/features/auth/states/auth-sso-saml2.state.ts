import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsFacade } from '@shared/features/settings/facades/settings.facade';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { AuthTokenInterface } from '../models/auth-login.interface';
import { AuthSsoSaml2Service } from '../services/auth-sso-saml2.service';

@Injectable({
  providedIn: 'root',
})
export class AuthSsoSaml2State {
  public entityName = 'authSsoSaml2State';

  public geRxMethods: GeRxMethods = {
    add: {
      main: this.authSuccess,
    },
    exception: {
      main: this.authnRequest,
      success: this.ssoRedirect,
    },
  };

  constructor(
    private authSsoSaml2Service: AuthSsoSaml2Service,
    private localstorageService: LocalStorageService,
    private router: Router,
    public settingsFacade: SettingsFacade
  ) {}

  authnRequest(req: string): Observable<unknown> {
    return this.authSsoSaml2Service.authnRequest(req);
  }

  ssoRedirect(res: AuthTokenInterface): Observable<void> {
    const method = this.settingsFacade.getData().general.authSsoHttpMethod;
    return of(this.authSsoSaml2Service.ssoRedirect(res, method));
  }

  authSuccess(data: AuthTokenInterface): Observable<void | Promise<boolean>> {
    return of(
      this.localstorageService.setTokens(data),
      this.router.navigate(data.location, {
        queryParams: data.locationParams,
      })
    );
  }
}
