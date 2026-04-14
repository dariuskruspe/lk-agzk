import { CommonModule } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { OnboardingModule } from '@features/onboarding/onboarding.module';
import { Environment } from '@shared/classes/ennvironment/environment';
import { EmptyComponent } from '@shared/components/empty/empty.component';
import { ModalWindowComponent } from '@shared/components/modal-window/modal-window.component';
import { AppSkeletonModule } from '@shared/directives/app-skeleton.module';
import { AppUpdaterComponent } from '@shared/features/app-updater/app-updater/app-updater.component';
import { ContactModule } from '@shared/features/contact/contact.module';
import { MessagesLangModule } from '@shared/features/messages-lang/messages-lang.module';
import { SignatureFileModule } from '@shared/features/signature-file/signature-file.module';
import { SignatureValidationFormModule } from '@shared/features/signature-validation-form/signature-validation-form.module';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { rootProviders } from './root.providers';
import { LiquidProviderComponent } from "./shared/features/liquid-design/liquid-provider/liquid-provider.component";

@NgModule({
  declarations: [AppComponent, ModalWindowComponent, EmptyComponent],
  imports: [
    CommonModule,
    MessagesLangModule,
    SignatureValidationFormModule,
    SignatureFileModule,
    ToastModule,
    AppRoutingModule,
    OnboardingModule,
    MatIconModule,
    ButtonModule,
    ContactModule,
    RippleModule,
    AppSkeletonModule,
    AppUpdaterComponent,
    LiquidProviderComponent
],
  bootstrap: [AppComponent],
  // entryComponents: [AppComponent],
  exports: [AppComponent, RouterModule],
  providers: [provideHttpClient(withInterceptorsFromDi()), ...rootProviders],
})
export class AppModule {
  static forRoot(
    data: {
      api?: string;
    } = {},
    providers: Provider[] = [],
  ): ModuleWithProviders<AppModule> {
    if (data?.api) {
      Environment.changeEnv('api', data.api);
    }
    return {
      ngModule: AppModule,
      providers: [...providers],
    };
  }
}
