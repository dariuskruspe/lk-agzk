import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IssuesManagementFiltersComponent } from '@features/issues-management/components/issues-management-filters/issues-management-filters.component';
import { FilterModule } from '@shared/features/fpc-filter/filter.module';
import { LangModule } from '@shared/features/lang/lang.module';
import { LoadableListModule } from '@shared/features/loadable-list/loadable-list.module';
import { IconPackModule } from '@shared/pipes/icon-pack.module';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToolbarModule } from 'primeng/toolbar';
import { IssuesModule } from '../issues/issues.module';
import { IssuesManagementListComponent } from './components/issues-management-list/issues-management-list.component';
import { IssuesManagementDialogComponent } from './components/issues-managment-dialog/issues-management-dialog.component';
import { IssuesManagementListContainerComponent } from './containers/issues-management-list-container/issues-management-list-container.component';
import { IssuesManagementRoutingModule } from './issues-management-routing.module';
import { FiltersDialogComponent } from "@shared/components/filters-dialog/filters-dialog.component";
import { FiltersSidebarComponent } from "@shared/components/filters-sidebar/filters-sidebar.component";

@NgModule({
  declarations: [
    IssuesManagementListContainerComponent,
    IssuesManagementListComponent,
    IssuesManagementDialogComponent,
    IssuesManagementFiltersComponent,
  ],
  imports: [
    CommonModule,
    IssuesManagementRoutingModule,
    ReactiveFormsModule,
    IssuesModule,
    LangModule,
    LoadableListModule,
    ToolbarModule,
    IconPackModule,
    ButtonModule,
    InputTextareaModule,
    FormsModule,
    InputTextModule,
    DropdownModule,
    MultiSelectModule,
    FilterModule,
    FiltersDialogComponent,
    FiltersSidebarComponent,
  ],
  exports: [],
})
export class IssuesManagementModule {}
