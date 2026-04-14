import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Environment } from '../../classes/ennvironment/environment';
import { PrimeFpcModule } from '@wafpc/prime/prime-form.module';
import { ErrorsInterceptor } from '../../interseptors/errors.interceptor';
import { HeadersInterceptor } from '../../interseptors/headers.interceptor';
import { LangModule } from '../lang/lang.module';
import { PrimeFpcAdapterContainerComponent } from './containers/prime-fpc-adapter-container/prime-fpc-container.component';
import { AsyncValidators } from './services/async-validators.service';

@NgModule({
  declarations: [PrimeFpcAdapterContainerComponent],
  imports: [
    CommonModule,
    LangModule,
    PrimeFpcModule.forRoot([
      {
        provide: 'apiToken',
        useValue: Environment.inv().api,
      },
      {
        provide: 'fileIconsPath',
        useValue: 'assets/files',
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: HeadersInterceptor,
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
      {
        provide: 'asyncValidators',
        useClass: AsyncValidators,
      },
    ]),
    PrimeFpcModule,
  ],
  exports: [PrimeFpcAdapterContainerComponent, PrimeFpcModule],
  providers: [AsyncValidators],
})
export class FpcModule {}
