import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { LangModule } from '../lang/lang.module';
import { ChangeMessagesLangComponent } from './components/change-messages-lang/change-messages-lang.component';

@NgModule({
  imports: [LangModule, ToolbarModule, ButtonModule],
  declarations: [ChangeMessagesLangComponent],
  exports: [ChangeMessagesLangComponent],
})
export class MessagesLangModule {}
