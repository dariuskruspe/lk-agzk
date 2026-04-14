import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { MessagesModule } from '../../shared/components/form-messages/messages.module';
import { ItemListBuilderModule } from '../../shared/components/item-list-builder/item-list-builder.module';
import { PdfViewerModule } from '../../shared/components/pdf-viewer/pdf-viewer.module';
import { ColoredNumberModule } from '../../shared/directives/colored-number.module';
import { FpcModule } from '../../shared/features/fpc/fpc.module';
import { LangModule } from '../../shared/features/lang/lang.module';
import { LoadableListModule } from '../../shared/features/loadable-list/loadable-list.module';
import { OwnerFilesViewDownloadModule } from '../../shared/features/owner-files-view-download/owner-files-view-download.module';
import { ReportDialogModule } from '../../shared/features/report-dialog/report-dialog.module';
import { SalariesDashboardIncomeComponent } from './components/salaries-dashboard-income/salaries-dashboard-income.component';
import { SalariesDashboardSalariesComponent } from './components/salaries-dashboard-salaries/salaries-dashboard-salaries.component';
import { SalariesDashboardTaxComponent } from './components/salaries-dashboard-tax/salaries-dashboard-tax.component';
import { SalariesIncomeDetailsComponent } from './components/salaries-income-details/salaries-income-details.component';
import { SalariesSalariesDetailsComponent } from './components/salaries-salaries-details/salaries-salaries-details.component';
import { SalariesTaxListItemComponent } from './components/salaries-tax-list-item/salaries-tax-list-item.component';
import { SalariesTaxListComponent } from './components/salaries-tax-list/salaries-tax-list.component';
import { SalariesDashboardContainerComponent } from './containers/salaries-dashboard-container/salaries-dashboard-container.component';
import { SalariesIncomeDetailsContainerComponent } from './containers/salaries-income-details-container/salaries-income-details-container.component';
import { SalariesSalariesDetailsContainerComponent } from './containers/salaries-salaries-details-container/salaries-salaries-details-container.component';
import { SalariesTaxListContainerComponent } from './containers/salaries-tax-list-container/salaries-tax-list-container.component';
import { SalariesRoutingModule } from './salaries-routing.module';

@NgModule({
  declarations: [
    SalariesDashboardContainerComponent,
    SalariesDashboardSalariesComponent,
    SalariesDashboardIncomeComponent,
    SalariesSalariesDetailsComponent,
    SalariesIncomeDetailsComponent,
    SalariesSalariesDetailsContainerComponent,
    SalariesIncomeDetailsContainerComponent,
    SalariesDashboardTaxComponent,
    SalariesTaxListItemComponent,
    SalariesTaxListComponent,
    SalariesTaxListContainerComponent,
  ],
  imports: [
    CommonModule,
    LangModule,
    MatIconModule,
    SalariesRoutingModule,
    ReactiveFormsModule,
    LoadableListModule,
    OwnerFilesViewDownloadModule,
    FpcModule,
    ItemListBuilderModule,
    CardModule,
    ButtonModule,
    ToolbarModule,
    ProgressSpinnerModule,
    PdfViewerModule,
    ReportDialogModule,
    CalendarModule,
    MessagesModule,
    ColoredNumberModule,
    TooltipModule,
  ],
})
export class SalariesModule {}
