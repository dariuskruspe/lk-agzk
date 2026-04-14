import { APP_BASE_HREF, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import localeEn from '@angular/common/locales/en';
import localeRu from '@angular/common/locales/ru';
import { ErrorHandler, LOCALE_ID, Provider, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GeRx } from 'gerx';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import OnbSetup from '../assets/onboarding-welcome/onb-setup.json';
import { Environment } from './shared/classes/ennvironment/environment';
import { LangFacade } from './shared/features/lang/facades/lang.facade';
import { TranslatePipe } from './shared/features/lang/pipes/lang.pipe';
import { MessageSnackbarService } from './shared/features/message-snackbar/message-snackbar.service';
import { resolvePlatformProviders } from './shared/features/platform-dependent/platform-providers-resolver';
import { CryptoProService } from './shared/features/signature-validation-form/services/crypto-pro.service';
import { CryptoProToken } from './shared/features/signature-validation-form/utils/local-services.token';
import { ErrorsInterceptor } from './shared/interseptors/errors.interceptor';
import { HeadersInterceptor } from './shared/interseptors/headers.interceptor';
import { ToastInterceptor } from './shared/interseptors/toast.interceptor';
import { DialogManagerService } from './shared/services/dialog-manager.service';
import { CustomDialogService } from './shared/services/dialog.service';
import { InitialLoadingService } from './shared/services/initial-loading.service';
import { CustomErrorHandler } from './shared/utilits/error-handler.util';

export const rootProviders: Provider[] = [
  GeRx,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HeadersInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ToastInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorsInterceptor,
    multi: true,
  },
  {
    provide: APP_BASE_HREF,
    useValue: Environment.inv().baseHref,
  },
  CustomErrorHandler,
  {
    provide: ErrorHandler,
    useClass: CustomErrorHandler,
  },
  Title,
  TranslatePipe,
  {
    provide: DialogService,
    useClass: CustomDialogService,
  },
  {
    provide: 'DIALOG_MANAGER',
    useClass: DialogManagerService,
  },
  {
    provide: CryptoProToken,
    useClass: CryptoProService,
  },
  MessageService,
  {
    provide: MessageSnackbarService,
    deps: [MessageService],
  },
  {
    provide: 'ONB_SETUP',
    useValue: OnbSetup,
  },
  {
    provide: LOCALE_ID,
    useFactory: () => {
      const langFacade = inject(LangFacade);
      const lang = langFacade.getLang();
      let locale: any;
      let resultLang: string;

      switch (lang) {
        case 'en':
          locale = localeEn;
          resultLang = 'en-US';
          break;
        case 'ru':
        default:
          locale = localeRu;
          resultLang = 'ru-RU';
          break;
      }
      registerLocaleData(locale);
      return resultLang;
    },
  },
  InitialLoadingService,
  ...resolvePlatformProviders((window as any).isDesktop),
];
