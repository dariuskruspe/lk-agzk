import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VacationsEmployeeFiltersComponent } from '@features/vacations-employee/components/vacations-employee-filters/vacations-employee-filters.component';
import { VacationsEmployeeListItemComponent } from '@features/vacations-employee/components/vacations-employee-list-item/vacations-employee-list-item.component';
import { VacationsEmployeeListComponent } from '@features/vacations-employee/components/vacations-employee-list/vacations-employee-list.component';
import { VacationsEmployeeContainerComponent } from '@features/vacations-employee/containers/vacations-employee-container/vacations-employee-container.component';
import { VacationsEmployeeRoutingModule } from '@features/vacations-employee/vacations-employee-routing.module';
import { FiltersSidebarComponent } from '@shared/components/filters-sidebar/filters-sidebar.component';
import { FiltersDialogComponent } from '@shared/components/filters-dialog/filters-dialog.component';
import { InfoComponent } from '@shared/components/info/info.component';
import { StatusModule } from '@shared/components/issue-status/status.module';
import { CalendarGraphModule } from '@shared/features/calendar-graph/calendar-graph.module';
import { FpcModule } from '@shared/features/fpc/fpc.module';
import { LangModule } from '@shared/features/lang/lang.module';
import { LoadableListModule } from '@shared/features/loadable-list/loadable-list.module';
import { FilterModule } from '@shared/features/fpc-filter/filter.module';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    VacationsEmployeeContainerComponent,
    VacationsEmployeeFiltersComponent,
    VacationsEmployeeListItemComponent,
    VacationsEmployeeListComponent,
  ],
  imports: [
    CommonModule,
    VacationsEmployeeRoutingModule,
    ButtonModule,
    DynamicDialogModule,
    CalendarGraphModule,
    ProgressBarModule,
    LangModule,
    FpcModule,
    TextFieldModule,
    InputTextareaModule,
    FormsModule,
    LoadableListModule,
    ToolbarModule,
    ProgressSpinnerModule,
    DropdownModule,
    StatusModule,
    CalendarModule,
    InputTextModule,
    MultiSelectModule,
    TooltipModule,
    ReactiveFormsModule,
    DialogModule,
    InfoComponent,
    FilterModule,
    FiltersSidebarComponent,
    FiltersDialogComponent,
    SplitButtonModule,
  ],
})
export class VacationsEmployeeModule {}
