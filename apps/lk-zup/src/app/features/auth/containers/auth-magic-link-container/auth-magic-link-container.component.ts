import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageSnackbarService } from '../../../../shared/features/message-snackbar/message-snackbar.service';
import { MessageType } from '../../../../shared/features/message-snackbar/models/message-type.enum';
import { CryptoService } from '../../../../shared/services/crypto.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { AuthLoginFacade } from '../../facades/auth-login.facade';
import { AuthMagicLinkInterface } from '../../models/auth-magic-link.interface';

@Component({
    template: '',
    standalone: false
})
export class AuthMagicLinkContainerComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageSnackbarService: MessageSnackbarService,
    private cryptoService: CryptoService,
    public authLoginFacade: AuthLoginFacade,
    public localstorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    const scryptData: AuthMagicLinkInterface = this.cryptoService.decrypt(
      this.activatedRoute.snapshot?.queryParams?.t
    );
    switch (scryptData?.type) {
      case 'login':
        this.authLogin(scryptData);
        break;
      case 'token':
        this.tokenRedirect(scryptData);
        break;
      default:
        this.loginPageRedirect();
        break;
    }
  }

  authLogin({ login, pass }: AuthMagicLinkInterface): void {
    if (login && pass) {
      this.authLoginFacade.authorizationReq({
        login,
        pass,
      });
    } else {
      this.messageSnackbarService.show(
        { message: 'Данные для входа не переданы или не верны' },
        MessageType.warn
      );
      this.loginPageRedirect();
    }
  }

  tokenRedirect(queryParams: AuthMagicLinkInterface): void {
    if (queryParams.token) {
      this.localstorageService.setTokens(queryParams);
    } else {
      this.messageSnackbarService.show(
        'Данные для входа не переданы или не верны',
        MessageType.warn
      );
    }
    this.loginPageRedirect();
  }

  loginPageRedirect(): void {
    this.router.navigate(['', 'auth']).then();
  }
}
