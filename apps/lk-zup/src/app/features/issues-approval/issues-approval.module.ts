import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { LangModule } from '../../shared/features/lang/lang.module';
import { IssuesEmailApprovalComponent } from './components/issues-email-approval/issues-email-approval.component';
import { IssuesEmailApprovalContainerComponent } from './containers/issues-email-approval-container/issues-email-approval-container.component';
import { IssuesApprovalRoutingModule } from './issues-approval-routing.module';

@NgModule({
  declarations: [
    IssuesEmailApprovalComponent,
    IssuesEmailApprovalContainerComponent,
  ],
  imports: [
    CommonModule,
    IssuesApprovalRoutingModule,
    CardModule,
    ProgressSpinnerModule,
    InputTextareaModule,
    FormsModule,
    ButtonModule,
    ToolbarModule,
    LangModule,
    TooltipModule,
  ],
})
export class IssuesApprovalModule {}
