import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from '@features/auth/components/auth/auth.component';
import { MessagesModule } from '@shared/components/form-messages/messages.module';
import { InfoComponent } from '@shared/components/info/info.component';
import { LogoComponent } from '@shared/components/logo/logo.component';
import { MaskModule } from '@shared/directives/mask.module';
import { LangModule } from '@shared/features/lang/lang.module';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';
import { MainModule } from '../main/main.module';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthFactor2CodeComponent } from './components/auth-factor2-code/auth-factor2-code.component';
import { AuthLoginComponent } from './components/auth-login/auth-login.component';
import { AuthRestorePasswordNewComponent } from './components/auth-restore-password-new/auth-restore-password-new.component';
import { AuthRestorePasswordComponent } from './components/auth-restore-password/auth-restore-password.component';
import { AuthSmsComponent } from './components/auth-sms/auth-sms.component';
import { AuthSsoSaml2Component } from './components/auth-sso-saml2/auth-sso-saml2.component';
import { AuthFactor2CodeContainerComponent } from './containers/auth-factor2-code-container/auth-factor2-code-container.component';
import { AuthLoginContainerComponent } from './containers/auth-login-container/auth-login-container.component';
import { AuthMagicLinkContainerComponent } from './containers/auth-magic-link-container/auth-magic-link-container.component';
import { AuthRestorePasswordContainerComponent } from './containers/auth-restore-password-container/auth-restore-password-container.component';
import { AuthRestorePasswordNewContainerComponent } from './containers/auth-restore-password-new-container/auth-restore-password-new-container.component';
import { AuthSmsContainerComponent } from './containers/auth-sms-container/auth-sms-container.component';
import { AuthSsoSaml2ContainerComponent } from './containers/auth-sso-saml2-container/auth-sso-saml2-container.component';
import { AuthSsoSaml2ResContainerComponent } from './containers/auth-sso-saml2-res-container/auth-sso-saml2-res-container.component';
import { AppSelectButtonComponent } from "@app/shared/components/app-select-button/app-select-button.component";
import { AppSelectButtonOptionComponent } from "@app/shared/components/app-select-button/app-select-button-option/app-select-button-option.component";

@NgModule({
  declarations: [
    AuthComponent,
    AuthLoginComponent,
    AuthLoginContainerComponent,
    AuthRestorePasswordComponent,
    AuthRestorePasswordContainerComponent,
    AuthSsoSaml2ContainerComponent,
    AuthSsoSaml2Component,
    AuthSsoSaml2ResContainerComponent,
    AuthRestorePasswordNewContainerComponent,
    AuthRestorePasswordNewComponent,
    AuthMagicLinkContainerComponent,
    AuthFactor2CodeComponent,
    AuthFactor2CodeContainerComponent,
    AuthSmsContainerComponent,
    AuthSmsComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    MainModule,
    LangModule,
    CardModule,
    ButtonModule,
    MaskModule,
    MessagesModule,
    PasswordModule,
    InputTextModule,
    InputMaskModule,
    ProgressSpinnerModule,
    TabViewModule,
    DividerModule,
    InfoComponent,
    LogoComponent,
    AppSelectButtonComponent,
    AppSelectButtonOptionComponent
],
  exports: [AuthLoginContainerComponent],
})
export class AuthModule {}
