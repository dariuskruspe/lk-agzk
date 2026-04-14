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
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { SurveysManagementContainerComponent } from './containers/surveys-management-container/surveys-management-container.component';
import { SurveysManagementRoutingModule } from './surveys-management-routing.module';
import { SurveysManagementCreateContainerComponent } from './containers/surveys-management-create-container/surveys-management-create-container.component';
import { IconPackModule } from '@shared/pipes/icon-pack.module';
import { CardModule } from 'primeng/card';
import { SurveysManagementTextFormComponent } from './components/surveys-management-text-form/surveys-management-text-form.component';
import { MaskModule } from '@shared/directives/mask.module';
import { DividerModule } from 'primeng/divider';
import { SurveysManagementCreateFormComponent } from './components/surveys-management-create-form/surveys-management-create-form.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SurveysManagementConstructorComponent } from './components/surveys-management-constructor/surveys-management-constructor.component';
import { ListboxModule } from 'primeng/listbox';
import { SurveysManagementPreviewComponent } from './components/surveys-management-preview/surveys-management-preview.component';
import { CheckboxModule } from 'primeng/checkbox';
import { SurveysManagementItemContainerComponent } from '@features/surveys-management/containers/surveys-management-item-container/surveys-management-item-container.component';
import { ItemListModule } from '@shared/components/item-list/item-list.module';
import { TabViewModule } from 'primeng/tabview';
import { CustomDialogService } from '@shared/services/dialog.service';
import { SurveysManagementEditFormComponent } from '@features/surveys-management/components/surveys-management-edit-form/surveys-management-edit-form.component';
import { StatusComponent } from '@shared/components/status/status.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Ripple } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
@NgModule({
  declarations: [
    SurveysManagementContainerComponent,
    SurveysManagementCreateContainerComponent,
    SurveysManagementCreateFormComponent,
    SurveysManagementTextFormComponent,
    SurveysManagementConstructorComponent,
    SurveysManagementPreviewComponent,
    SurveysManagementItemContainerComponent,
    SurveysManagementEditFormComponent,
  ],
  imports: [
    CommonModule,
    SurveysManagementRoutingModule,
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
    StatusComponent,
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
    ToastModule,
    ConfirmPopupModule,
    Ripple,
    SidebarModule,
  ],
  providers: [
    {
      provide: DialogService,
      useClass: CustomDialogService,
    },
    ToastModule,
    ConfirmPopupModule,
  ],
  exports: [SurveysManagementPreviewComponent],
})
export class SurveysManagementModule {}
