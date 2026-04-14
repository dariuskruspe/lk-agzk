import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { logError } from '@shared/utilits/logger';
import { GeRx } from 'gerx';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { AuthTokenInterface } from '../models/auth-login.interface';
import { AuthLoginService } from '../services/auth-login.service';
import { AuthFactor2CodeState } from './auth-factor2-code.state';

@Injectable({
  providedIn: 'root',
})
export class AuthLoginState {
  public entityName = 'authLogin';

  authType = Environment.inv().authType;

  public geRxMethods: GeRxMethods = {
    exception: {
      main: this.authLoginService.authorization.bind(this.authLoginService),
      success: this.authorizationReqSuccess,
      error: this.authorizationReqError,
    },
  };

  constructor(
    private router: Router,
    private geRx: GeRx,
    private authLoginService: AuthLoginService,
    private localstorageService: LocalStorageService,
    private authFactor2CodeState: AuthFactor2CodeState,
  ) {}

  authorizationReqSuccess(
    res: AuthTokenInterface,
  ): Observable<void | Promise<boolean>> {
    this.localstorageService.setTokens(res);
    if (typeof res.is2FAPassed !== 'undefined' && !res.is2FAPassed) {
      this.addEntityAuthFactor2Code();
      this.geRx.add(this.authFactor2CodeState.entityName);
      // this.deleteEntityAuthFactor2Code();
      return of(this.router.navigate(['', 'auth', 'f2']));
    }
    return of(this.router.navigate(['']));
  }

  authorizationReqError(error: HttpErrorResponse): Observable<void> {
    console.log('error', error);
    if (error.error.errorMsg) {
      switch (this.authType) {
        case 'sms':
          this.router.navigate(['/auth/sms']);
          break;
        case 'sso':
          this.router.navigate(['/auth/saml2-redirect']);
          break;
        case 'login':
          this.router.navigate(['/auth']);
          break;
        default:
          break;
      }
    }
    logError(error);
    return of();
  }

  addEntityAuthFactor2Code(): void {
    this.geRx.addEntity(
      this.authFactor2CodeState.entityName,
      this.authFactor2CodeState.geRxMethods,
      this.authFactor2CodeState,
    );
  }

  deleteEntityAuthFactor2Code(): void {
    this.geRx.deleteEntity(this.authFactor2CodeState.entityName);
  }
}
