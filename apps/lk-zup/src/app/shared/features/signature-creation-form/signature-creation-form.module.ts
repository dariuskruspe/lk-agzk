import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InfoComponent } from '@shared/components/info/info.component';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ToolbarModule } from 'primeng/toolbar';
import { ItemListModule } from '../../components/item-list/item-list.module';
import { FpcModule } from '../fpc/fpc.module';
import { LangModule } from '../lang/lang.module';
import { AbstractCreationComponent } from './components/abstract-creation/abstract-creation.component';
import { ConfirmCreationComponent } from './components/confirm-creation/confirm-creation.component';
import { ExternalCreationComponent } from './components/external-creation/external-creation.component';
import { IssueCreationComponent } from './components/issue-creation/issue-creation.component';
import { LinkCreationComponent } from './components/link-creation/link-creation.component';
import { PasswordCreationComponent } from './components/password-creation/password-creation.component';
import { SmsCreationComponent } from './components/sms-creation/sms-creation.component';
import { SignatureCreationFormContainerComponent } from './containers/signature-creation-form-container/signature-creation-form-container.component';
import { SmsCreationContainerComponent } from './containers/sms-creation-container/sms-creation-container.component';

@NgModule({
  imports: [
    CommonModule,
    FpcModule,
    ToolbarModule,
    ButtonModule,
    LangModule,
    ItemListModule,
    RouterModule,
    InputTextModule,
    KeyFilterModule,
    FormsModule,
    InputMaskModule,
    InfoComponent,
  ],
  declarations: [
    SignatureCreationFormContainerComponent,
    PasswordCreationComponent,
    LinkCreationComponent,
    ConfirmCreationComponent,
    AbstractCreationComponent,
    ExternalCreationComponent,
    SmsCreationComponent,
    SmsCreationContainerComponent,
    IssueCreationComponent,
  ],
  exports: [SignatureCreationFormContainerComponent],
})
export class SignatureCreationFormModule {}
