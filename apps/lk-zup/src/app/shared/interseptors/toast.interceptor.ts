import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslatePipe } from '@shared/features/lang/pipes/lang.pipe';
import { logError } from '@shared/utilits/logger';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessageSnackbarService } from '../features/message-snackbar/message-snackbar.service';
import { MessageType } from '../features/message-snackbar/models/message-type.enum';
import { ToastInterface } from '../features/message-snackbar/models/toast.interface';

@Injectable()
export class ToastInterceptor implements HttpInterceptor {
  constructor(
    private snackbar: MessageSnackbarService,
    private translationPipe: TranslatePipe
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpResponse<unknown>> {
    return next.handle(req).pipe(
      tap((res: HttpResponse<ToastInterface>) => {
        if (res.body?.toast) {
          this.handleToast(res.body);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
        } else if (Array.isArray(res.body?.signingData)) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this.handleToasts(res.body?.signingData as ToastInterface[]);
        }
      })
    );
  }

  private handleToast(res: ToastInterface): void {
    if (res?.toast.message) {
      this.snackbar.show(
        {
          message:
            res.toast.message.text && res.toast.message.text?.length > 100
              ? res.toast.message.text.substring(0, 100) + '...'
              : res.toast.message?.text || '',
          title: res.toast.message?.header || '',
          button:
            res.toast?.type === 'error'
              ? {
                  title: this.translationPipe.transform('COPY_ERROR_TEXT'),
                  callback: this.copyText.bind(
                    this,
                    res.toast.message.text || ''
                  ),
                  icon: 'pi-copy',
                }
              : undefined,
        },
        res.toast?.type || MessageType.info
      );
    }
  }

  private copyText(text: string) {
    navigator.clipboard.writeText(text).then(
      () => {
        this.snackbar.show(
          this.translationPipe.transform('ERROR_TEXT_COPIED_SUCCESSFULLY'),
          MessageType.success
        );
      },
      () => {
        logError(new Error('Failed to copy'));
      }
    );
  }

  private handleToasts(res: ToastInterface[]): void {
    res.forEach((toast) => this.handleToast(toast));
  }
}
