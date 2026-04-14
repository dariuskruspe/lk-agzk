import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FiltersSidebarComponent } from '@shared/components/filters-sidebar/filters-sidebar.component';
import { FiltersDialogComponent } from '@shared/components/filters-dialog/filters-dialog.component';
import { InfoComponent } from '@shared/components/info/info.component';
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
import { SurveysEmployeeRoutingModule } from './surveys-employee-routing.module';
import { IconPackModule } from '@shared/pipes/icon-pack.module';
import { CardModule } from 'primeng/card';
import { MaskModule } from '@shared/directives/mask.module';
import { DividerModule } from 'primeng/divider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ListboxModule } from 'primeng/listbox';
import { CheckboxModule } from 'primeng/checkbox';
import {ItemListModule} from "@shared/components/item-list/item-list.module";
import {TabViewModule} from "primeng/tabview";
import {
  SurveysEmployeeContainerComponent
} from "@features/surveys-employee/containers/surveys-employee-container/surveys-employee-container.component";
import {
  SurveysEmployeeItemContainerComponent
} from "@features/surveys-employee/containers/surveys-employee-item-container/surveys-employee-item-container.component";
import {SurveysManagementModule} from "@features/surveys-management/surveys-management.module";
import {StatusModule} from "@shared/components/issue-status/status.module";
@NgModule({
  declarations: [
    SurveysEmployeeContainerComponent,
    SurveysEmployeeItemContainerComponent
  ],
  imports: [
    CommonModule,
    SurveysEmployeeRoutingModule,
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
    IconPackModule,
    CardModule,
    MaskModule,
    DividerModule,
    RadioButtonModule,
    ListboxModule,
    CheckboxModule,
    ItemListModule,
    TabViewModule,
    SurveysManagementModule,
  ],
})
export class SurveysEmployeeModule {}
