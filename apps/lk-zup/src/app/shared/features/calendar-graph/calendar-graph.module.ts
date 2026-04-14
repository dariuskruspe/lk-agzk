import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfoComponent } from '@shared/components/info/info.component';
import { FilterModule } from '@shared/features/fpc-filter/filter.module';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SidebarModule } from 'primeng/sidebar';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { StatusModule } from '@shared/components/issue-status/status.module';
import { FpcModule } from '../fpc/fpc.module';
import { LangModule } from '../lang/lang.module';
import { CalendarGraphDayNumberingComponent } from './components/calendar-graph-day-numbering/calendar-graph-day-numbering.component';
import { CalendarGraphFilterComponent } from './components/calendar-graph-filter/calendar-graph-filter.component';
import { CalendarGraphFullscreenFiltersComponent } from './components/calendar-graph-fullscreen-filters/calendar-graph-fullscreen-filters.component';
import { CalendarGraphMemberListComponent } from './components/calendar-graph-member-list/calendar-graph-member-list.component';
import { CalendarGraphMobileIntersectionComponent } from './components/calendar-graph-mobile-intersection/calendar-graph-mobile-intersection.component';
import { CalendarGraphMonthPointComponent } from './components/calendar-graph-month-point/calendar-graph-month-point.component';
import { CalendarGraphTimeLineComponent } from './components/calendar-graph-time-line/calendar-graph-time-line.component';
import { CalendarGraphContainerComponent } from './containers/calendar-graph-container/calendar-graph-container.component';
import { CalendarGraphMobileContainerComponent } from './containers/calendar-graph-mobile-container/calendar-graph-mobile-container.component';
import { PeriodTypePipe } from './utils/vacation-type.pipe';

@NgModule({
  declarations: [
    CalendarGraphContainerComponent,
    CalendarGraphTimeLineComponent,
    CalendarGraphFilterComponent,
    CalendarGraphMemberListComponent,
    CalendarGraphDayNumberingComponent,
    CalendarGraphMonthPointComponent,
    PeriodTypePipe,
    CalendarGraphMobileContainerComponent,
    CalendarGraphMobileIntersectionComponent,
    CalendarGraphFullscreenFiltersComponent,
  ],
  imports: [
    CommonModule,
    FpcModule,
    ReactiveFormsModule,
    LangModule,
    DynamicDialogModule,
    StatusModule,
    TooltipModule,
    MultiSelectModule,
    FilterModule,
    OverlayPanelModule,
    SidebarModule,
    ToolbarModule,
    ButtonModule,
    RippleModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    ProgressSpinnerModule,
    CheckboxModule,
    FormsModule,
    CalendarModule,
    InfoComponent,
  ],
  providers: [PeriodTypePipe],
  exports: [
    CalendarGraphContainerComponent,
    PeriodTypePipe,
    CalendarGraphMobileContainerComponent,
    CalendarGraphFullscreenFiltersComponent,
    CalendarGraphTimeLineComponent,
  ],
})
export class CalendarGraphModule {}
