import {
  ModuleWithProviders,
  NgModule,
  Provider,
  enableProdMode,
  isDevMode,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '@env/environment';
import {
  BOOTSTRAP_PARAMS,
  BootstrapParamsInterface,
} from '@shared/models/bootstrap-params.interface';
import { AppHelperService } from '@shared/services/helpers/app-helper.service';
import { logDebug } from '@shared/utilits/logger';
import { AppModule as AppSharedModule } from './app-shared.module';
import { AppComponent } from './app.component';
import { LiquidProviderComponent } from './shared/features/liquid-design/liquid-provider/liquid-provider.component';

if ((environment as any).enableProdMode) {
  enableProdMode();
}

logDebug('isDevMode', isDevMode());

function initializeAppFactory(appHelper: AppHelperService) {
  return () => {};
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppSharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    LiquidProviderComponent,
  ],
  bootstrap: [AppComponent],
  providers: [
    provideAppInitializer(() => {
      const initializerFn = initializeAppFactory(inject(AppHelperService));
      return initializerFn();
    }),
  ],
})
export class AppModule {
  static forRoot(
    params?: BootstrapParamsInterface,
  ): ModuleWithProviders<AppModule> {
    const providers: Provider[] = [];

    if (params) {
      providers.push({
        provide: BOOTSTRAP_PARAMS,
        useValue: params,
      });
    }
    return {
      ngModule: AppModule,
      providers,
    };
  }
}
