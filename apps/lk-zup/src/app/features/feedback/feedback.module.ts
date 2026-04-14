import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackContainerComponent } from '@features/feedback/containers/feedback-container/feedback-container.component';
import { FeedbackItemContainerComponent } from '@features/feedback/containers/feedback-item-container/feedback-item-container.component';
import { ToolbarModule } from 'primeng/toolbar';
import { LoadableListModule } from '@shared/features/loadable-list/loadable-list.module';
import { LangModule } from '@shared/features/lang/lang.module';
import { FeedbackFormComponent } from '@features/feedback/components/feedback-form/feedback-form.component';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { SurveysManagementModule } from '@features/surveys-management/surveys-management.module';
import { TooltipModule } from 'primeng/tooltip';
import { SplitButtonModule } from 'primeng/splitbutton';
@NgModule({
  declarations: [
    FeedbackContainerComponent,
    FeedbackItemContainerComponent,
    FeedbackFormComponent,
  ],
  imports: [
    CommonModule,
    FeedbackRoutingModule,
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
export class FeedbackModule {}
