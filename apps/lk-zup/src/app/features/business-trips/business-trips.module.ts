import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BusinessTripsRoutingModule } from '@features/business-trips/business-trips-routing.module';
import { BusinessTripsInfoDialogComponent } from '@features/business-trips/components/business-trips-info-dialog/business-trips-info-dialog.component';
import { BusinessTripsListDashboardComponent } from '@features/business-trips/components/business-trips-list-dashboard/business-trips-list-dashboard.component';
import { BusinessTripsDashboardContainerComponent } from '@features/business-trips/containers/business-trips-list-dashboard-container/business-trips-dashboard-container.component';
import { IssuesModule } from '@features/issues/issues.module';
import { DocSingArchDownloadModule } from '@shared/components/doc-sing-arch-download/doc-sing-arch-download.module';
import { InfoComponent } from '@shared/components/info/info.component';
import { MaskModule } from '@shared/directives/mask.module';
import { CalendarGraphModule } from '@shared/features/calendar-graph/calendar-graph.module';
import { FpcModule } from '@shared/features/fpc/fpc.module';
import { LangModule } from '@shared/features/lang/lang.module';
import { LoadableListModule } from '@shared/features/loadable-list/loadable-list.module';
import { OwnerFilesViewDownloadModule } from '@shared/features/owner-files-view-download/owner-files-view-download.module';
import { SignatureFileModule } from '@shared/features/signature-file/signature-file.module';
import { SignatureValidationFormModule } from '@shared/features/signature-validation-form/signature-validation-form.module';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { BusinessTripV2Component } from '@features/business-trip_v2/business-trip-v2/business-trip-v2.component';
import { EmployeeBusinessTripV2Component } from '@features/business-trip_v2/employee-business-trip-v2/employee-business-trip-v2.component';

@NgModule({
  declarations: [
    BusinessTripsListDashboardComponent,
    BusinessTripsDashboardContainerComponent,
    BusinessTripsInfoDialogComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    BusinessTripsRoutingModule,
    FpcModule,
    ReactiveFormsModule,
    MaskModule,
    LangModule,
    SignatureValidationFormModule,
    LoadableListModule,
    OwnerFilesViewDownloadModule,
    IssuesModule,
    DocSingArchDownloadModule,
    ButtonModule,
    ToolbarModule,
    SignatureFileModule,
    CalendarGraphModule,
    DropdownModule,
    InputTextModule,
    MultiSelectModule,
    FormsModule,
    DialogModule,
    RippleModule,
    SidebarModule,
    SplitButtonModule,
    InfoComponent,
    BusinessTripV2Component,
    EmployeeBusinessTripV2Component,
  ],
})
export class BusinessTripSModule {}
