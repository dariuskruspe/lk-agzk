import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardBusinessTripsComponent } from '@features/dashboard/components/dashboard-business-trips/dashboard-business-trips.component';
import { DashboardCurrentStateComponent } from '@features/dashboard/components/dashboard-current-state/dashboard-current-state.component';
import { DashboardFilesComponent } from '@features/dashboard/components/dashboard-files/dashboard-files.component';
import { DashboardIssueComponent } from '@features/dashboard/components/dashboard-issue/dashboard-issue.component';
import { DashboardMyApprovalsComponent } from '@features/dashboard/components/dashboard-my-approvals/dashboard-my-approvals.component';
import { DashboardPopularRequestsComponent } from '@features/dashboard/components/dashboard-popular-requests/dashboard-popular-requests.component';
import { DashboardSalaryComponent } from '@features/dashboard/components/dashboard-salary/dashboard-salary.component';
import { DashboardVacationReportsComponent } from '@features/dashboard/components/dashboard-vacation-reports/dashboard-vacation-reports.component';
import { DashboardVacationComponent } from '@features/dashboard/components/dashboard-vacation/dashboard-vacation.component';
import { DashboardMainContainerComponent } from '@features/dashboard/containers/dashboard-main-container/dashboard-main-container.component';
import { DashboardRoutingModule } from '@features/dashboard/dashboard-routing.module';
import { PDropdownFixDirective } from '@features/dashboard/directives/tzeDropdownFix.directive';
import { IssuesModule } from '@features/issues/issues.module';
import { SalariesModule } from '@features/salaries/salaries.module';
import { VacationsModule } from '@features/vacations/vacations.module';
import { ZupCardModule } from '@shared/components/card/zup-card.module';
import { MessagesModule } from '@shared/components/form-messages/messages.module';
import { ItemListBuilderModule } from '@shared/components/item-list-builder/item-list-builder.module';
import { StatusModule } from '@shared/components/issue-status/status.module';
import { WidgetComponent } from '@shared/components/widget/widget.component';
import { AppSkeletonModule } from '@shared/directives/app-skeleton.module';
import { MaskModule } from '@shared/directives/mask.module';
import { LangModule } from '@shared/features/lang/lang.module';
import { LoadableListModule } from '@shared/features/loadable-list/loadable-list.module';
import { ReportDialogModule } from '@shared/features/report-dialog/report-dialog.module';
import { IconPackModule } from '@shared/pipes/icon-pack.module';
import { TrustedHtmlModule } from '@shared/pipes/security/trusted-html.module';
import { CustomDialogService } from '@shared/services/dialog.service';
import { GridstackModule } from 'gridstack/dist/angular';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { DashboardCustomWidgetsComponent } from './components/dashboard-cutom-widgets/dashboard-cutom-widgets.component';
import { DashboardCustomWidgetsDialogComponent } from './components/dashboard-cutom-widgets-dialog/dashboard-cutom-widgets-dialog.component';
import { DashboardCustomPageComponent } from './components/dashboard-custom-page/dashboard-custom-page.component';
import { TrustedUrlPipe } from './pipes/trusted-url.pipe';
import { PanelMenuModule } from 'primeng/panelmenu';
import { LiquidContainerComponent } from '@app/shared/features/liquid/liquid-container.component';
import { LucideAngularModule } from 'lucide-angular';

@NgModule({
	declarations: [
		DashboardMainContainerComponent,
		DashboardIssueComponent,
		DashboardPopularRequestsComponent,
		DashboardCurrentStateComponent,
		DashboardVacationComponent,
		DashboardSalaryComponent,
		DashboardFilesComponent,
		DashboardVacationReportsComponent,
		PDropdownFixDirective,
		DashboardBusinessTripsComponent,
		DashboardMyApprovalsComponent,
		DashboardCustomWidgetsComponent,
		DashboardCustomWidgetsDialogComponent,
		DashboardCustomPageComponent,
		TrustedUrlPipe,
	],
	exports: [DashboardMainContainerComponent],
	imports: [
		CommonModule,
		DashboardRoutingModule,
		ReactiveFormsModule,
		SalariesModule,
		VacationsModule,
		MaskModule,
		LangModule,
		ItemListBuilderModule,
		DynamicDialogModule,
		ToolbarModule,
		ButtonModule,
		CardModule,
		InputTextModule,
		CalendarModule,
		BadgeModule,
		LoadableListModule,
		ZupCardModule,
		ReportDialogModule,
		MessagesModule,
		StatusModule,
		IssuesModule,
		IconPackModule,
		ToastModule,
		FormsModule,
		DropdownModule,
		TooltipModule,
		AppSkeletonModule,
		GridstackModule,
		WidgetComponent,
		TrustedHtmlModule,
		MatIconModule,
		PanelMenuModule,
		LiquidContainerComponent,
		LucideAngularModule,
	],
	providers: [
		{
			provide: DialogService,
			useClass: CustomDialogService,
		},
	],
})
export class DashboardModule {}
