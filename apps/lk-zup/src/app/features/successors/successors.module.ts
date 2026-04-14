import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SuccessorsRoutingModule } from './successors-routing.module';
import { ToolbarModule } from 'primeng/toolbar';
import { LoadableListModule } from '@shared/features/loadable-list/loadable-list.module';
import { LangModule } from '@shared/features/lang/lang.module';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { SurveysManagementModule } from '@features/surveys-management/surveys-management.module';
import { TooltipModule } from 'primeng/tooltip';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TabViewModule } from 'primeng/tabview';
import { InputTextareaModule } from 'primeng/inputtextarea';
import {
  SuccessorsContainerComponent
} from '@features/successors/containers/successors-container/successors-container.component';
import {
  SuccessorsItemContainerComponent
} from '@features/successors/containers/successors-item-container/successors-item-container.component';
import { FilterModule } from '@shared/features/fpc-filter/filter.module';
import {DropdownModule} from "primeng/dropdown";
import {FiltersDialogComponent} from "@shared/components/filters-dialog/filters-dialog.component";
@NgModule({
  declarations: [
    SuccessorsContainerComponent,
    SuccessorsItemContainerComponent,
  ],
    imports: [
        CommonModule,
        SuccessorsRoutingModule,
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
        FilterModule,
        DropdownModule,
        FiltersDialogComponent,
    ],
})
export class SuccessorsModule {}
