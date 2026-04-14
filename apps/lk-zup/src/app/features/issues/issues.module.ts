import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IssuesDocsSignComponent } from '@features/issues/components/issues-docs-sign/issues-docs-sign.component';
import { IssuesDocsToSignComponent } from '@features/issues/components/issues-docs-to-sign/issues-docs-to-sign.component';
import { IssuesFiltersComponent } from '@features/issues/components/issues-filters/issues-filters.component';
import { IssuesShowComponent } from '@features/issues/components/issues-show/issues-show.component';
import { IssuesShowContainerComponent } from '@features/issues/containers/issues-show-container/issues-show-container.component';
import { DocSingArchDownloadModule } from '@shared/components/doc-sing-arch-download/doc-sing-arch-download.module';
import { FileUploaderModule } from '@shared/components/file-uploader/file-uploader.module';
import { MessagesModule } from '@shared/components/form-messages/messages.module';
import { IssuesCancelModalModule } from '@shared/components/issues-cancel-modal/issues-cancel-modal.module';
import { ItemListBuilderModule } from '@shared/components/item-list-builder/item-list-builder.module';
import { ItemListModule } from '@shared/components/item-list/item-list.module';
import { PdfViewerModule } from '@shared/components/pdf-viewer/pdf-viewer.module';
import { StatusModule } from '@shared/components/issue-status/status.module';
import { StepsComponent } from '@shared/components/steps/steps.component';
import { MaskModule } from '@shared/directives/mask.module';
import { PluralizeModule } from '@shared/directives/pluralize.module';
import { FilterModule } from '@shared/features/fpc-filter/filter.module';
import { FpcModule } from '@shared/features/fpc/fpc.module';
import { GroupedListModule } from '@shared/features/grouped-list/grouped-list.module';
import { LangModule } from '@shared/features/lang/lang.module';
import { LoadableListModule } from '@shared/features/loadable-list/loadable-list.module';
import { OwnerFilesViewDownloadModule } from '@shared/features/owner-files-view-download/owner-files-view-download.module';
import { SignatureValidationFormModule } from '@shared/features/signature-validation-form/signature-validation-form.module';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { IssuesAddDialogComponent } from './components/issues-add-dialog/issues-add-dialog.component';
import { AbstractCustomIssueComponent } from './components/issues-add-templates/abstract-custom-issue/abstract-custom-issue.component';
import { IssuesAddBusinessTripComponent } from './components/issues-add-templates/issues-add-business-trip/issues-add-business-trip.component';
import { IssuesAddCommandComponent } from './components/issues-add-templates/issues-add-command/issues-add-command.component';
import { IssuesAddCompensationComponent } from './components/issues-add-templates/issues-add-compensation/issues-add-compensation.component';
import { IssuesDynamicFieldsCommonComponent } from './components/issues-add-templates/issues-add-dynamic-fields-common/issues-add-dynamic-fields-common.component';
import { IssuesAddInsuranceComponent } from './components/issues-add-templates/issues-add-insurance/issues-add-insurance.component';
import { IssuesAddOvertimeWorkComponent } from './components/issues-add-templates/issues-add-overtime-work/issues-add-overtime-work.component';
import { IssuesAddPersonnelTransferComponent } from './components/issues-add-templates/issues-add-personnel-transfer/issues-add-personnel-transfer.component';
import { IssuesAddUnscheduledVacationComponent } from './components/issues-add-templates/issues-add-unscheduled-vacation/issues-add-unscheduled-vacation.component';
import { IssuesAddWeekendHourlyComponent } from './components/issues-add-templates/issues-add-weekend-hourly/issues-add-weekend-hourly.component';
import { IssuesAddWeekendWorkComponent } from './components/issues-add-templates/issues-add-weekend-work/issues-add-weekend-work.component';
import { IssuesAddComponent } from './components/issues-add/issues-add.component';
import { IssuesCrossingDialogComponent } from './components/issues-crossing-dialog/issues-crossing-dialog.component';
import { IssuesListDashboardComponent } from './components/issues-list-dashboard/issues-list-dashboard.component';
import { IssuesManagementApproveComponent } from './components/issues-management-approve/issues-management-approve.component';
import { IssuesStatusStepsComponent } from './components/issues-status-steps/issues-status-steps.component';
import { IssuesTypeListComponent } from './components/issues-type-list/issues-type-list.component';
import { IssuesAbstractAddContainerComponent } from './containers/issues-abstract-add-container/issues-abstract-add-container.component';
import { IssuesAddContainerComponent } from './containers/issues-add-container/issues-add-container.component';
import { IssuesAddDialogContainerComponent } from './containers/issues-add-dialog-container/issues-add-dialog-container.component';
import { IssuesAddStaticContainerComponent } from './containers/issues-add-static-container/issues-add-static-container.component';
import { IssuesApproveDialogContainerComponent } from './containers/issues-approve-dialog-container/issues-approve-dialog-container.component';
import { IssuesListDashboardContainerComponent } from './containers/issues-list-dashboard-container/issues-list-dashboard-container.component';
import { IssuesTypeListContainerComponent } from './containers/issues-type-list-container/issues-type-list-container.component';
import { IssuesRoutingModule } from './issues-routing.module';
import { ItemLinkListModule } from '@shared/components/item-link-list/item-link-list.module';
import { IssuesCopyAttachmentDialogComponent } from './components/issues-copy-attachment-dialog/issues-copy-attachment-dialog.component';

@NgModule({
  declarations: [
    IssuesTypeListContainerComponent,
    IssuesTypeListComponent,
    IssuesAddContainerComponent,
    IssuesAddComponent,
    IssuesShowContainerComponent,
    IssuesShowComponent,
    IssuesAddStaticContainerComponent,
    IssuesAddCommandComponent,
    IssuesAddBusinessTripComponent,
    IssuesAddDialogContainerComponent,
    IssuesAddDialogComponent,
    IssuesAddWeekendWorkComponent,
    IssuesAddOvertimeWorkComponent,
    IssuesDynamicFieldsCommonComponent,
    IssuesListDashboardComponent,
    IssuesListDashboardContainerComponent,
    IssuesDocsSignComponent,
    IssuesDocsToSignComponent,
    IssuesAddCompensationComponent,
    IssuesAddInsuranceComponent,
    IssuesAddWeekendHourlyComponent,
    IssuesManagementApproveComponent,
    IssuesAbstractAddContainerComponent,
    IssuesAddPersonnelTransferComponent,
    IssuesApproveDialogContainerComponent,
    IssuesAddUnscheduledVacationComponent,
    AbstractCustomIssueComponent,
    IssuesCrossingDialogComponent,
    IssuesStatusStepsComponent,
    IssuesFiltersComponent,
    IssuesCopyAttachmentDialogComponent,
  ],
  imports: [
    CommonModule,
    DialogModule,
    DynamicDialogModule,
    MatIconModule,
    IssuesRoutingModule,
    FpcModule,
    ReactiveFormsModule,
    MaskModule,
    LangModule,
    LoadableListModule,
    OwnerFilesViewDownloadModule,
    ItemListModule,
    DocSingArchDownloadModule,
    ButtonModule,
    CardModule,
    ToolbarModule,
    PdfViewerModule,
    InputTextModule,
    MessagesModule,
    CalendarModule,
    DropdownModule,
    InputTextareaModule,
    SelectButtonModule,
    FormsModule,
    TabViewModule,
    FileUploaderModule,
    AccordionModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    ItemListBuilderModule,
    IssuesCancelModalModule,
    StatusModule,
    SignatureValidationFormModule,
    ListboxModule,
    DividerModule,
    PluralizeModule,
    GroupedListModule,
    RippleModule,
    TooltipModule,
    StepsComponent,
    MultiSelectModule,
    FilterModule,
    ItemLinkListModule,
  ],
  exports: [
    IssuesShowComponent,
    IssuesDocsSignComponent,
    IssuesShowContainerComponent,
  ],
  providers: [DialogService, DynamicDialogConfig, DynamicDialogRef],
})
export class IssuesModule {}
