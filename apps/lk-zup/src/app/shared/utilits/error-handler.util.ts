import { ErrorHandler, Injectable } from '@angular/core';
import { logError, logWarn } from '@shared/utilits/logger';
import { Subscription } from 'rxjs';
import Version from '../../../version/version.json';
import { EmployeesStaticDataFacade } from '../../features/employees/facades/employees-static-data.facade';
import { TranslatePipe } from '../features/lang/pipes/lang.pipe';
import { MessageSnackbarService } from '../features/message-snackbar/message-snackbar.service';
import { MessageType } from '../features/message-snackbar/models/message-type.enum';
import { SettingsFacade } from '../features/settings/facades/settings.facade';
import { FileDownloadService } from '../services/file-download.service';

const ERROR_TYPE_TAG = 'error_type';
const ERROR_CODE_TAG = 'error_code';
const ERROR_MESSAGE_TAG = 'error_message';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
  private dsn = 'https://e598e013f44c4749ad5c1aec903973f2@sentry.9958258.ru/5';

  private isSentryEnabled = false;

  private ver = Version;

  private subscriptions: Subscription;

  constructor(
    private settingsFacade: SettingsFacade,
    private toastsService: MessageSnackbarService,
    private staticDataFacade: EmployeesStaticDataFacade,
    private translationPipe: TranslatePipe,
    private fileDownload: FileDownloadService
  ) {
    this.init();
    this.setSentryParams();

    this.getSentry().then(Sentry => {
      if (Sentry) {
        Sentry.addEventProcessor((event, hint) => this.handleErrorMessage(event, hint));
      }
    });
  }

  async handleError(error: any): Promise<void> {
    const Sentry = await this.getSentry();
    if (Sentry) {
      Sentry.captureException(error.originalError || error);
    }
    throw error;
  }

  private async init(): Promise<void> {
    const env =
      // eslint-disable-next-line no-nested-ternary
      window.location.hostname.endsWith('wiseadvice.ru') ||
      window.location.hostname.endsWith('empldocs.app')
        ? 'prod'
        : window.location.hostname.endsWith('wagroup.ru') ||
        window.location.hostname.endsWith('test-wa.ru')
          ? 'dev'
          : 'unknown';
    const initValue = {
      dsn: this.dsn,
      beforeBreadcrumb(breadcrumb, hint) {
        switch (breadcrumb.category) {
          case 'console':
            if (
              breadcrumb.message ===
              'formData is deprecated! Please use immutable structure with observable formData$'
            ) {
              return null;
            }
            break;
          case 'ui.click':
            switch (true) {
              case !!hint.event?.target.closest('.custom-list-item'):
                // eslint-disable-next-line no-param-reassign
                breadcrumb.message = `Список - ${
                  hint.event?.target
                    .closest('.custom-list-item')
                    .querySelector('.header-text').innerText
                }`;
                break;
              case !!hint.event?.target.closest('button')?.innerText:
                // eslint-disable-next-line no-param-reassign
                breadcrumb.message = `Кнопка - ${
                  hint.event?.target.closest('button').innerText
                }`;
                break;
              case !!hint.event?.target.closest('li')?.innerText:
                // eslint-disable-next-line no-param-reassign
                breadcrumb.message = `Меню/список - ${
                  hint.event?.target.closest('li').innerText
                }`;
                break;
              default:
                // eslint-disable-next-line no-param-reassign
                breadcrumb.message = `${breadcrumb.message}`;
                break;
            }
            break;
          default:
            break;
        }
        return breadcrumb;
      },
      enableTracing: false,
      environment: env,
      sendDefaultPii: true,
      debug: env !== 'prod',
    };
    const Sentry = await this.getSentry();
    if (Sentry) {
      Sentry.init(initValue);
    }
  }

  private setSentryParams(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
    this.subscriptions = new Subscription();

    this.subscriptions.add(
      this.staticDataFacade.getData$().subscribe(async (user) => {
        if (user) {
          const Sentry = await this.getSentry();
          if (Sentry) {
            Sentry.setUser({email: user.email.value});
            Sentry.setContext('employee', {
              name: user.fullName,
              position: user.position,
            });
          }
        }
      })
    );
    this.subscriptions.add(
      this.settingsFacade.getData$().subscribe(async (settings) => {
        this.isSentryEnabled = settings.general.sentryEnabled ?? false;
        const Sentry = await this.getSentry();
        if (Sentry) {
          Sentry.setTag(
            'lks-version',
            `${this.ver?.version} | ${settings?.general?.version}`
          );
        }
        }
      )
      )
        ;
      }

  private async handleErrorMessage(
    event,
    hint
  ) {
    try {
      if (!event.tags) {
        event.tags = {};
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const error = JSON.stringify(hint.originalException?.error, null, 2);
      // eslint-disable-next-line no-param-reassign
      event.message = error;
      const Sentry = await this.getSentry();
      if (Sentry) {
        Sentry.setExtra('body', error);
      }

      // eslint-disable-next-line no-param-reassign
      event.tags[ERROR_TYPE_TAG] = 'client';
    } catch (e) {
      logError(e);
    }

    const exception = (
      (hint.originalException as any)?.rejection
        ? (hint.originalException as any).rejection
        : hint.originalException
    ) as {
      toast: string;
      status: number;
      message: string;
      url: string;
    };

    try {
      // eslint-disable-next-line no-param-reassign
      event.tags[ERROR_TYPE_TAG] = 'http';
      // eslint-disable-next-line no-param-reassign
      event.tags[ERROR_CODE_TAG] = exception.status;
      // eslint-disable-next-line no-param-reassign
      event.tags[ERROR_MESSAGE_TAG] = exception.message;
    } catch (e) {
      logError(e);
    }

    if (!this.isSentryEnabled || exception?.status === 401) {
      const stringifiedError = JSON.stringify(
        {...event, ...hint},
        undefined,
        4
      );
      const toast: any = {
        button: {
          title: 'DOWNLOAD_ERROR',
          callback: this.downloadErrorFile.bind(this, stringifiedError),
          icon: 'pi-download',
        },
      };
      if (exception?.toast && exception?.status < 500) {
        toast.message = this.translationPipe.transform(exception?.toast);
      } else {
        toast.title = this.translationPipe.transform('UNPREDICTABLE_ERROR');
        toast.message = this.translationPipe.transform(
          'WE_ARE_WORKING_ON_THIS_ERROR'
        );
      }
      this.toastsService.show(toast, MessageType.error);
      return null;
    }

    if (exception?.toast) {
      const errorString = {
        errorNumber: event.event_id,
        errorMessage: exception.message,
      };
      this.toastsService.show(
        {
          message: this.translationPipe.transform(exception?.toast),
          button: {
            title: 'COPY_ERROR_ID',
            callback: this.copyErrorNumber.bind(
              this,
              JSON.stringify(errorString)
            ),
            icon: 'pi-copy',
          },
        },
        MessageType.error
      );
    }

    return event;
  }

  private downloadErrorFile(error: string): void {
    const blob = new Blob([error], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    this.fileDownload.download(url, 'empldocs_error.txt');
  }

  private copyErrorNumber(errorId: string): void {
    navigator.clipboard.writeText(errorId).then(
      () => {
        this.toastsService.show(
          this.translationPipe.transform('ERROR_COPIED_SUCCESSFULLY'),
          MessageType.success
        );
      },
      () => {
        logWarn('Failed to copy');
      }
    );
  }

  private async getSentry() {
    if (!this.isSentryEnabled) return null;
    const Sentry = await import('@sentry/angular');
    return Sentry;
  }
}
