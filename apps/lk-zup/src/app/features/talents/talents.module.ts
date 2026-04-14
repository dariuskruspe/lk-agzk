import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TalentsRoutingModule } from './talents-routing.module';
import { ToolbarModule } from 'primeng/toolbar';
import { LoadableListModule } from '@shared/features/loadable-list/loadable-list.module';
import { LangModule } from '@shared/features/lang/lang.module';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { SurveysManagementModule } from '@features/surveys-management/surveys-management.module';
import { TooltipModule } from 'primeng/tooltip';
import { TalentsContainerComponent } from '@features/talents/containers/talents-container/talents-container.component';
import { TalentsItemContainerComponent } from '@features/talents/containers/talents-item-container/talents-item-container.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TabViewModule } from 'primeng/tabview';
import { DeleteTalentDialogComponent } from '@features/talents/components/delete-talent-dialog/delete-talent-dialog.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Talents9GridComponent } from '@features/talents/components/talents-9-grid/talents-9-grid.component';
import {FiltersDialogComponent} from "@shared/components/filters-dialog/filters-dialog.component";
import {CheckboxModule} from "primeng/checkbox";
import {DropdownModule} from "primeng/dropdown";
import {MultiSelectModule} from "primeng/multiselect";
@NgModule({
  declarations: [
    TalentsContainerComponent,
    TalentsItemContainerComponent,
    DeleteTalentDialogComponent,
    Talents9GridComponent,
  ],
  imports: [
    CommonModule,
    TalentsRoutingModule,
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
    TabViewModule,
    InputTextareaModule,
    FormsModule,
    FiltersDialogComponent,
    CheckboxModule,
    DropdownModule,
    MultiSelectModule,
  ],
})
export class TalentsModule {}
