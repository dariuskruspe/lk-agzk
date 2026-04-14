import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { NewsletterManagementRoutingModule } from './newsletter-management-routing.module';
import { ToolbarModule } from 'primeng/toolbar';
import { LoadableListModule } from '@shared/features/loadable-list/loadable-list.module';
import { LangModule } from '@shared/features/lang/lang.module';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
// import { EditorModule } from 'primeng/editor';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { NewsletterManagementContainerComponent } from './containers/newsletter-management-container/newsletter-management-container.component';
import { NewsletterListContainerComponent } from './containers/newsletter-list-container/newsletter-list-container.component';
import { NewsletterCreateContainerComponent } from './containers/newsletter-create-container/newsletter-create-container.component';
import { NewsletterViewContainerComponent } from './containers/newsletter-view-container/newsletter-view-container.component';
import { MessageTemplatesContainerComponent } from './containers/message-templates-container/message-templates-container.component';
import { MessageTemplateCreateContainerComponent } from './containers/message-template-create-container/message-template-create-container.component';
import { MessageTemplateEditorComponent } from './components/message-template-editor/message-template-editor.component';
import { NewsletterService } from './services/newsletter.service';
import { MessageTemplateService } from './services/message-template.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { TrustedHtmlModule } from '@shared/pipes/security/trusted-html.module';
import { NewsletterFileUploadComponent } from './components/newsletter-file-upload/newsletter-file-upload.component';

@NgModule({
  declarations: [
    NewsletterManagementContainerComponent,
    NewsletterListContainerComponent,
    NewsletterCreateContainerComponent,
    NewsletterViewContainerComponent,
    MessageTemplatesContainerComponent,
    MessageTemplateCreateContainerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NewsletterManagementRoutingModule,
    ButtonModule,
    ToolbarModule,
    LoadableListModule,
    LangModule,
    DividerModule,
    InputTextModule,
    ReactiveFormsModule,
    CardModule,
    TabViewModule,
    InputTextareaModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    FileUploadModule,
    // EditorModule,
    DialogModule,
    ConfirmDialogModule,
    SplitButtonModule,
    TagModule,
    BadgeModule,
    PaginatorModule,
    ProgressBarModule,
    TooltipModule,
    DynamicDialogModule,
    FormsModule,
    MessageTemplateEditorComponent,
    InputSwitchModule,
    MultiSelectModule,
    TrustedHtmlModule,
    NewsletterFileUploadComponent
  ],
  providers: [
    NewsletterService,
    MessageTemplateService,
    DatePipe,
    DialogService,
  ],
})
export class NewsletterManagementModule {}
