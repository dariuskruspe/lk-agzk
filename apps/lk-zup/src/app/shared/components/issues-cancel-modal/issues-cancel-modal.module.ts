import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { FpcModule } from '../../features/fpc/fpc.module';
import { LangModule } from '../../features/lang/lang.module';
import { IssuesCancelModalComponent } from './issues-cancel-modal.component';

@NgModule({
  declarations: [IssuesCancelModalComponent],
  imports: [
    CommonModule,
    FpcModule,
    ToolbarModule,
    ButtonModule,
    LangModule,
    ButtonModule,
    DialogModule,
  ],
  exports: [FpcModule, IssuesCancelModalComponent],
})
export class IssuesCancelModalModule {}
