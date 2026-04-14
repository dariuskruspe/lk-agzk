import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { logError } from '@shared/utilits/logger';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';
import { TranslatePipe } from '../../../shared/features/lang/pipes/lang.pipe';
import { MessageSnackbarService } from '../../../shared/features/message-snackbar/message-snackbar.service';
import { MessageType } from '../../../shared/features/message-snackbar/models/message-type.enum';
import { AuthRestorePasswordInterface } from '../models/auth-restore-password.interface';
import { AuthRestorePasswordService } from '../services/auth-restore-password.service';

@Injectable({
  providedIn: 'root',
})
export class AuthRestorePasswordState {
  public entityName = 'restorePassword';

  public geRxMethods: GeRxMethods = {
    exception: {
      main: this.restorePassword,
    },
    edit: {
      main: this.setPassword,
      success: this.setPasswordSuccess,
      error: this.setPasswordError,
    },
    delete: {
      main: this.checkLinkValidity,
      error: this.redirectToAuth,
    },
  };

  constructor(
    private router: Router,
    private restorePasswordService: AuthRestorePasswordService,
    private messagesSnackbar: MessageSnackbarService,
    private translatePipe: TranslatePipe
  ) {}

  restorePassword(data: AuthRestorePasswordInterface): Observable<{
    email: string;
  }> {
    return this.restorePasswordService.restorePassword(data);
  }

  setPassword(data: { userdata: string; newPass: string }): Observable<{
    userdata: string;
    newPass: string;
  }> {
    return this.restorePasswordService.setPassword(data);
  }

  private setPasswordSuccess(): Observable<Promise<boolean>> {
    this.messagesSnackbar.show(
      this.translatePipe.transform('SUCCESS_PASSWORD_CREATED'),
      MessageType.success
    );
    return this.redirectToAuth();
  }

  private checkLinkValidity(params: { userData: string }): Observable<void> {
    return this.restorePasswordService.checkLinkValidity(params);
  }

  private redirectToAuth(): Observable<Promise<boolean>> {
    return of(this.router.navigate(['', 'auth']));
  }

  setPasswordError(error: HttpErrorResponse): Observable<void> {
    if (error.error.errorMsg === 'Ссылка уже использована') {
      this.router.navigate(['/auth']);
    }
    logError(error, 'AuthRestorePasswordState');
    return of();
  }
}
