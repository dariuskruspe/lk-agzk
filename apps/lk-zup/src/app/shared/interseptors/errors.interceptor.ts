import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { AppService } from '@shared/services/app.service';
import { logError } from '@shared/utilits/logger';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthLoginService } from '../../features/auth/services/auth-login.service';
import { Environment } from '../classes/ennvironment/environment';
import {
  PDF_CONVERT_ERROR,
  SERVER_ERRORS,
} from '../constants/server-errors.constant';
import { TranslatePipe } from '../features/lang/pipes/lang.pipe';
import { MessageSnackbarService } from '../features/message-snackbar/message-snackbar.service';
import { MessageType } from '../features/message-snackbar/models/message-type.enum';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {
  settingsSignal: WritableSignal<SettingsInterface> =
    this.app.storage.settings.data.frontend.signal.globalSettings;

  constructor(
    private authService: AuthLoginService,
    private toastService: MessageSnackbarService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private translatePipe: TranslatePipe,
    private translationPipe: TranslatePipe,
    private app: AppService,
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorsHandler(error);
        return throwError(error);
      }),
    );
  }

  // Добавление поля toast к ошибке необходимо для обработки ее перед отправкой в сентри
  // и добавления айдишника ошибки к тосту
  errorsHandler(response: HttpErrorResponse): void {
    const res: HttpErrorResponse = response;
    if (!res) return;

    if (res?.error?.reloadTimeout) {
      const reloadTime = (res.error.reloadTimeout as number) * 1000 || 0;
      setTimeout(() => {
        window.location.reload();
      }, reloadTime);
    }
    if (!(res instanceof HttpErrorResponse)) {
      return this.handleUnknownError(res);
    }

    logError(res, 'errors.interceptor.ts');

    const errorStatus: number = res.status;

    let showError: boolean = true;
    let customErrorMessage: string = '';

    switch (errorStatus) {
      case 400:
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        res.toast = res.error?.errorMsg;
        // eslint-disable-next-line no-case-declarations
        const resForSentry = { ...res, toast: res.error?.errorMsg };
        this.captureSentryEvent(res.error, resForSentry).then(() => {});
        break;
      case 401:
        if (res.url?.indexOf('auth') === -1) {
          const options: { queryParams?: unknown } = {};
          if (Environment.inv().authType === 'sso') {
            options.queryParams = { hasError: false };
          }

          this.localStorageService.clearTokens();
          this.localStorageService.clearSettings();
          this.localStorageService.clearUserSettings();
          this.localStorageService.clearHasUnsignedDocuments();
          customErrorMessage = this.translatePipe.transform('ERROR_401');

          this.app.redirectToLoginPage({ hasError: false });
        }
        break;
      case 403:
        if (res.url?.indexOf('login') === -1) {
          customErrorMessage =
            res.error?.errorMsg ?? this.translatePipe.transform('ERROR_403');
        }
        if (res.url?.indexOf('login') > -1) {
          customErrorMessage =
            res.error?.errorMsg ??
            this.translatePipe.transform('ERROR_403_LOGIN');
        }
        break;
      case 404:
        break;
      case 406:
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        res.toast =
          res.error?.errorMsg || this.translatePipe.transform('ERROR_404_HINT');
        // eslint-disable-next-line no-case-declarations
        const resSentry = {
          ...res,
          toast:
            res.error?.errorMsg ||
            this.translatePipe.transform('ERROR_404_HINT'),
        };
        this.captureSentryEvent(res.error, resSentry).then(() => {});
        break;
      case 500:
      default:
        // eslint-disable-next-line no-case-declarations
        let toastMsg = this.translatePipe.transform('ERROR_UNKNOWN');
        // eslint-disable-next-line no-case-declarations
        let errorMsg;

        if (typeof res.error === 'string') {
          errorMsg = SERVER_ERRORS.find((msg) => res.error.startsWith(msg));

          if (res.error === PDF_CONVERT_ERROR) {
            toastMsg = this.translatePipe.transform('PDF_CONVERT_ERROR');
          } else if (res.error.toLowerCase().includes('database is updating')) {
            showError = false;
            this.router.navigate(['', 'database-update']);
          } else if (errorMsg || res.url?.includes('/settings')) {
            this.router.navigate(['', 'something-went-wrong']);
            toastMsg = errorMsg;
          }
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        res.toast = toastMsg;
        // eslint-disable-next-line no-case-declarations
        const resWithToast = { ...res, toast: toastMsg };
        this.captureSentryEvent(res.error ?? {}, resWithToast).then(() => {});
        break;
    }

    if (!showError) return;

    if (customErrorMessage) {
      this.toastService.show(customErrorMessage, MessageType.error);
      return;
    }

    this.toastService.show(
      {
        message: (res as any).toast,
        button: {
          title: 'COPY_ERROR_ID',
          callback: this.copyErrorNumber.bind(this, JSON.stringify(res.error)),
          icon: 'pi-copy',
        },
      },
      MessageType.error,
    );
  }

  private async captureSentryEvent(error: any, originalException: any) {
    if (!this.settingsSignal()?.general?.sentryEnabled) {
      return;
    }
    const Sentry = await import('@sentry/angular');
    Sentry.captureEvent(error, { originalException });
  }

  handleUnknownError(res: any): void {
    logError(res, 'errors.interceptor.ts');

    let resAsString: string;

    if (typeof res === 'string') resAsString = res;
    else {
      resAsString = (res as any).toString?.() || JSON.stringify(res);
    }

    this.toastService.show(
      {
        message: this.translatePipe.transform('ERROR_UNKNOWN'),
        button: {
          title: 'COPY_ERROR_ID',
          callback: this.copyErrorNumber.bind(this, resAsString),
          icon: 'pi-copy',
        },
      },
      MessageType.error,
    );

    return;
  }

  private copyErrorNumber(errorId: string): void {
    navigator.clipboard.writeText(errorId).then(
      () => {
        this.toastService.show(
          this.translationPipe.transform('ERROR_COPIED_SUCCESSFULLY'),
          MessageType.success,
        );
      },
      () => {
        logError(new Error('Failed to copy'));
      },
    );
  }
}
