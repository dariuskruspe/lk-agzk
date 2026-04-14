import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiImgDirective } from '@shared/directives/api-img.directive';
import { CryptoProCertSelectComponent } from '@shared/features/crypto-pro/crypto-pro-cert-select/crypto-pro-cert-select.component';
import { IconEmptyComponent } from '@shared/icons/icon-empty.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToolbarModule } from 'primeng/toolbar';
import { FpcModule } from '../fpc/fpc.module';
import { LangModule } from '../lang/lang.module';
import { SignatureCreationFormModule } from '../signature-creation-form/signature-creation-form.module';
import { AbstractValidationComponent } from './components/abstract-validation/abstract-validation.component';
import { AdditionalMessageComponent } from './components/additional-message/additional-message.component';
import { AppValidationComponent } from './components/app-validation/app-validation.component';
import { ConfirmValidationComponent } from './components/confirm-validation/confirm-validation.component';
import { CreationSignatureComponent } from './components/creation-signature/creation-signature.component';
import { LinkValidationComponent } from './components/link-validation/link-validation.component';
import { LocalValidationComponent } from './components/local-validation/local-validation.component';
import { PasswordValidationComponent } from './components/password-validation/password-validation.component';
import { ProvidersChoiceComponent } from './components/providers-choice/providers-choice.component';
import { SmsValidationComponent } from './components/sms-validation/sms-validation.component';
import { SignatureValidationContainerComponent } from './containers/signature-validation-form-container/signature-validation-form-container.component';
import { SmsValidationContainerComponent } from './containers/sms-validation-container/sms-validation-container.component';
import { SignatureValidationService } from './services/signature-validation.service';

@NgModule({
  declarations: [
    SignatureValidationContainerComponent,
    LinkValidationComponent,
    PasswordValidationComponent,
    ConfirmValidationComponent,
    AppValidationComponent,
    AbstractValidationComponent,
    CreationSignatureComponent,
    AdditionalMessageComponent,
    ProvidersChoiceComponent,
    LocalValidationComponent,
    SmsValidationComponent,
    SmsValidationContainerComponent,
  ],
  imports: [
    CommonModule,
    LangModule,
    ButtonModule,
    SignatureCreationFormModule,
    FormsModule,
    ToolbarModule,
    CheckboxModule,
    FpcModule,
    RouterModule,
    DropdownModule,
    ProgressSpinnerModule,
    InputMaskModule,
    CryptoProCertSelectComponent,
    ApiImgDirective,
    IconEmptyComponent,
    MessageModule,
  ],
  providers: [SignatureValidationService],
  exports: [AdditionalMessageComponent],
})
export class SignatureValidationFormModule {}
