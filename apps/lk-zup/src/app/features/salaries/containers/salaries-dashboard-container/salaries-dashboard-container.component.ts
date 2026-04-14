import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ProgressBar } from 'primeng/progressbar';
import { LangFacade } from '../../../../shared/features/lang/facades/lang.facade';
import { ReportDialogContainerComponent } from '../../../../shared/features/report-dialog/containers/report-dialog-container/report-dialog-container.component';
import { SettingsFacade } from '../../../../shared/features/settings/facades/settings.facade';
import {
  Preloader,
  providePreloader,
} from '../../../../shared/services/preloader.service';
import { DashboardVacationReportsFacade } from '../../../dashboard/facades/dashboard-vacation-reports.facade';
import { DashboardWorkPeriodFacade } from '../../../dashboard/facades/dashboard-work-period.facade';
import { IssuesStatusListFacade } from '../../../issues/facades/issues-status-list.facade';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '../../../main/utils/breadcrumb-provider.utils';
import { SalariesDashboardIncomeFacade } from '../../facades/salaries-dashboard-income.facade';
import { SalariesDashboardSalariesFacade } from '../../facades/salaries-dashboard-salaries.facade';
import { SalariesDashboardTaxFacade } from '../../facades/salaries-dashboard-tax.facade';
import { SalariesImgReportFacade } from '../../facades/salaries-img-report.facade';

@Component({
    selector: 'app-salaries-dashboard-container',
    templateUrl: './salaries-dashboard-container.component.html',
    styleUrls: ['./salaries-dashboard-container.component.scss'],
    providers: [
        providePreloader(ProgressBar),
        provideBreadcrumb('BREADCRUMBS_SALARY', 0),
    ],
    standalone: false
})
export class SalariesDashboardContainerComponent implements OnInit {
  textShow;

  showSubtitle = false;

  constructor(
    public salariesDashboardSalariesFacade: SalariesDashboardSalariesFacade,
    public langFacade: LangFacade,
    public workPeriodFacade: DashboardWorkPeriodFacade,
    public dialogService: DialogService,
    public salariesDashboardIncomeFacade: SalariesDashboardIncomeFacade,
    public salariesDashboardTaxFacade: SalariesDashboardTaxFacade,
    public issuesStatusListFacade: IssuesStatusListFacade,
    public router: Router,
    public settingsFacade: SettingsFacade,
    private salaryReportFacade: SalariesImgReportFacade,
    private preloader: Preloader,
    public vacationReportsFacade: DashboardVacationReportsFacade,
    @Inject(BREADCRUMB) private _: unknown,
  ) {}

  ngOnInit(): void {
    this.preloader.setCondition(
      this.salariesDashboardSalariesFacade.loading$(),
      this.salariesDashboardIncomeFacade.loading$(),
    );
    this.workPeriodFacade.getWorkPeriods();
    this.salariesDashboardIncomeFacade.getPayslipIncome();
    this.salariesDashboardTaxFacade.getIncomeTax({
      page: 1,
      count: 4,
      useSkip: true,
    });
    if (this.vacationReportsFacade.getData()) {
      this.showSubtitle = !!this.vacationReportsFacade
        .getData()
        .reports.find((report) => {
          return report.reportId === 'payslip_av';
        });
    } else {
      this.vacationReportsFacade.getReports();
      this.vacationReportsFacade.getData$().subscribe((data) => {
        this.showSubtitle = !!data.reports.find((report) => {
          return report.reportId === 'payslip_av';
        });
      });
    }
  }

  workPeriodDateUpdate(data: string): void {
    this.salariesDashboardSalariesFacade.getSalary(data);
  }

  textDisplayChange(): void {
    this.textShow = !this.textShow;
  }

  openSalaryImgDialog(date: string): void {
    this.dialogService.open(ReportDialogContainerComponent, {
      width: '1065px',
      data: {
        params: { date },
        facade: this.salaryReportFacade,
      },
      closable: true,
    });
  }

  onIssueDetails(issueID: string): void {
    this.router.navigate(['salaries', 'tax', issueID]).then();
  }

  toIssues(): void {
    this.router
      .navigate(['issues', 'types'], {
        queryParams: { groupAlias: 'taxDeduction' },
      })
      .then();
  }
}
