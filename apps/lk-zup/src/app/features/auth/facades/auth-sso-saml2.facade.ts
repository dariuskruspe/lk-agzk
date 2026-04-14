import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { MessageSnackbarService } from '../../../shared/features/message-snackbar/message-snackbar.service';
import { MessageType } from '../../../shared/features/message-snackbar/models/message-type.enum';
import { decodeBase64Url } from '../../../shared/utilits/base-64-url.util';
import { AuthTokenInterface } from '../models/auth-login.interface';
import { AuthSsoSaml2State } from '../states/auth-sso-saml2.state';

@Injectable({
  providedIn: 'root',
})
export class AuthSsoSaml2Facade extends AbstractFacade<void> {
  constructor(
    protected geRx: GeRx,
    protected store: AuthSsoSaml2State,
    private router: Router,
    private snackbar: MessageSnackbarService,
    private localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  authnRequest(req: string): void {
    this.geRx.exception(this.store.entityName, req);
  }

  authAttempt(query: AuthTokenInterface): void {
    if (query.error) {
      const error: { errorMsg: string } = JSON.parse(
        decodeURIComponent(escape(atob(decodeBase64Url(query.error))))
      );
      this.snackbar.show(error.errorMsg, MessageType.error);
      this.router.navigate(['/auth'], {
        queryParams: {
          hasError: true,
        },
      });
      return;
    }
    const data: AuthTokenInterface = {} as AuthTokenInterface;
    const location = this.localstorageService.getPreviousBlockedUrl();
    if (location) {
      const params = {
        ...this.localstorageService.getPreviousBlockedUrlParams(),
      };
      this.localstorageService.clearPreviousBlockedUrl();
      data.location = [location];
      data.locationParams = params;
    } else {
      data.location = ['/'];
    }
    data.token = query.token;

    this.geRx.add(this.store.entityName, data);
  }
}
