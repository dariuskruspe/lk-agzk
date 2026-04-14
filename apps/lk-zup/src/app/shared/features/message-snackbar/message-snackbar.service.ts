import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, SubscriptionLike } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MessageType } from './models/message-type.enum';

@Injectable({ providedIn: 'root' })
export class MessageSnackbarService {
  private debouncer = new Subject<{
    data:
      | {
          message: string;
          text?: string;
          title?: string;
          button?: {
            icon?: string;
            title: string;
            callback: string;
          };
        }
      | string;
    type: MessageType;
    life?: number;
  }>();

  public debounceTimeMs: number = 200;

  public toastLifeTimeMs: number = 5000;

  private subscription: SubscriptionLike;

  constructor(private messageService: MessageService) {
    if (!this.subscription) {
      this.subscription = this.debouncer
        .pipe(debounceTime(this.debounceTimeMs))
        .subscribe((toast) => {
          let message;
          let title = '';
          if (typeof toast.data === 'string') {
            message = toast.data;
          } else {
            message = (toast.data.message || toast.data.text) ?? '';
            title = toast.data.title ?? '';
          }
          this.messageService.add({
            severity: toast.type,
            summary: title,
            detail: message,
            data: {
              button: (
                toast.data as {
                  button?: {
                    icon?: string;
                    title: string;
                    callback: string;
                  };
                }
              )?.button,
            },
            life: toast.life ?? this.toastLifeTimeMs,
          });
        });
    }
  }

  show(
    data:
      | {
          message: string;
          title?: string;
          button?: {
            icon?: string;
            title: string;
            callback: string;
          };
        }
      | string,
    type: MessageType,
    life: number = this.toastLifeTimeMs
  ): void {
    this.debouncer.next({
      data,
      type,
      life,
    });
  }
}
