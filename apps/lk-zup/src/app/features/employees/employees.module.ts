import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ItemListBuilderModule } from '../../shared/components/item-list-builder/item-list-builder.module';
import { ItemListModule } from '../../shared/components/item-list/item-list.module';
import { LangModule } from '../../shared/features/lang/lang.module';
import { LoadableListModule } from '../../shared/features/loadable-list/loadable-list.module';
import { FilterModule } from '../../shared/pipes/filter.module';
import { CustomDialogService } from '../../shared/services/dialog.service';
import { EmployeesListItemComponent } from './components/employees-list-item/employees-list-item.component';
import { EmployeesListComponent } from './components/employees-list/employees-list.component';
import { EmployeesShowComponent } from './components/employees-show/employees-show.component';
import { EmployeesListContainerComponent } from './containers/employees-list-container/employees-list-container.component';
import { EmployeesShowContainerComponent } from './containers/employees-show-container/employees-show-container.component';
import { EmployeesShowDialogContainerComponent } from './containers/employees-show-dialog-container/employees-show-dialog-container.component';
import { EmployeesRoutingModule } from './employees-routing.module';
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { CheckboxModule } from "primeng/checkbox";
import { FiltersDialogComponent } from "@shared/components/filters-dialog/filters-dialog.component";
import { FiltersSidebarComponent } from "@shared/components/filters-sidebar/filters-sidebar.component";

@NgModule({
  declarations: [
    EmployeesListComponent,
    EmployeesListContainerComponent,
    EmployeesShowComponent,
    EmployeesShowContainerComponent,
    EmployeesListItemComponent,
    EmployeesShowDialogContainerComponent,
  ],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    LangModule,
    ReactiveFormsModule,
    FormsModule,
    LoadableListModule,
    ItemListBuilderModule,
    CardModule,
    DynamicDialogModule,
    ButtonModule,
    ToolbarModule,
    DynamicDialogModule,
    ButtonModule,
    FilterModule,
    ItemListModule,
    DropdownModule,
    InputTextModule,
    MultiSelectModule,
    CheckboxModule,
    FiltersDialogComponent,
    FiltersSidebarComponent,
  ],
  providers: [
    {
      provide: DialogService,
      useClass: CustomDialogService,
    },
  ],
})
export class EmployeesModule {}
