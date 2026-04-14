import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StatusModule } from '@shared/components/issue-status/status.module';
import { PluralizeModule } from '@shared/directives/pluralize.module';
import { CalendarGraphModule } from '@shared/features/calendar-graph/calendar-graph.module';
import { FpcModule } from '@shared/features/fpc/fpc.module';
import { LangModule } from '@shared/features/lang/lang.module';
import { LoadableListModule } from '@shared/features/loadable-list/loadable-list.module';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { VacationsApproveDialogComponent } from './components/vacations-approve-dialog/vacations-approve-dialog.component';
import { VacationsEditDialogComponent } from './components/vacations-edit-dialog/vacations-edit-dialog.component';
import { VacationsGraphComponent } from './components/vacations-graph/vacations-graph.component';
import { VacationsInfoDialogComponent } from './components/vacations-info-dialog/vacations-info-dialog.component';
import { VacationsTextDialogComponent } from './components/vacations-text-dialog/vacations-text-dialog.component';
import { VacationsGraphContainerComponent } from './containers/vacations-graph-container/vacations-graph-container.component';
import { VacationsRoutingModule } from './vacations-routing.module';
import { VacationsV2Component } from '../vacations_v2/vacations-v2/vacations-v2.component';
import { VacationsManagementV2Component } from '../vacations-management_v2/vacations-management-v2/vacations-management-v2.component';

@NgModule({
  declarations: [
    VacationsGraphContainerComponent,
    VacationsGraphComponent,
    VacationsEditDialogComponent,
    VacationsApproveDialogComponent,
    VacationsInfoDialogComponent,
    VacationsTextDialogComponent,
  ],
  imports: [
    CommonModule,
    VacationsRoutingModule,
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
    PluralizeModule,
    TooltipModule,
    SplitButtonModule,
    VacationsV2Component,
    VacationsManagementV2Component,
  ],
})
export class VacationsModule {}
