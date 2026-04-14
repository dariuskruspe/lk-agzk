import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FeedbackManagementRoutingModule } from './feedback-management-routing.module';
import { ToolbarModule } from 'primeng/toolbar';
import { LoadableListModule } from '@shared/features/loadable-list/loadable-list.module';
import { LangModule } from '@shared/features/lang/lang.module';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { SurveysManagementModule } from '@features/surveys-management/surveys-management.module';
import { TooltipModule } from 'primeng/tooltip';
import { FeedbackManagementContainerComponent } from '@features/feedback-management/containers/feedback-management-container/feedback-management-container.component';
import { FeedbackManagementItemContainerComponent } from '@features/feedback-management/containers/feedback-management-item-container/feedback-management-item-container.component';
import { SplitButtonModule } from 'primeng/splitbutton';
@NgModule({
  declarations: [
    FeedbackManagementContainerComponent,
    FeedbackManagementItemContainerComponent,
  ],
  imports: [
    CommonModule,
    FeedbackManagementRoutingModule,
    ButtonModule,
    ToolbarModule,
    LoadableListModule,
    LangModule,
    DividerModule,
    InputTextModule,
    ReactiveFormsModule,
    CardModule,
    SurveysManagementModule,
    TooltipModule,
    SplitButtonModule,
  ],
})
export class FeedbackManagementModule {}
