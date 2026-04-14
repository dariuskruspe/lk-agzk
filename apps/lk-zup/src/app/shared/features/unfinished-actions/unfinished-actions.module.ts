import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { NotificationItemComponent } from '../../components/notification-item/notification-item.component';
import { LangModule } from '../lang/lang.module';
import {
  AbstractActionComponent,
  AbstractConfirmationActionComponent,
} from './components/abstract-action/abstract-action.component';
import { ConfirmationCodeComponent } from './components/confirmation-code/confirmation-code.component';
import { MessageComponent } from './components/message/message.component';
import { UnfinishedActionsContainerComponent } from './containers/unfinished-actions-container/unfinished-actions-container.component';
import { InputMaskModule } from 'primeng/inputmask';

@NgModule({
  declarations: [
    AbstractActionComponent,
    AbstractConfirmationActionComponent,
    ConfirmationCodeComponent,
    MessageComponent,
    UnfinishedActionsContainerComponent,
  ],
  imports: [
    CommonModule,
    InputTextModule,
    LangModule,
    ReactiveFormsModule,
    ButtonModule,
    FormsModule,
    DialogModule,
    NotificationItemComponent,
    ToolbarModule,
    InputNumberModule,
    InputMaskModule,
  ],
  exports: [UnfinishedActionsContainerComponent],
})
export class UnfinishedActionsModule {}
