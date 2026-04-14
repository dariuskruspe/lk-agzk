import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LangFacade } from '../../../../shared/features/lang/facades/lang.facade';
import { DashboardWorkPeriodFacade } from '../../../dashboard/facades/dashboard-work-period.facade';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '../../../main/utils/breadcrumb-provider.utils';
import { SalariesDashboardSalariesFacade } from '../../facades/salaries-dashboard-salaries.facade';

@Component({
    selector: 'app-salaries-salaries-details-container',
    templateUrl: './salaries-salaries-details-container.component.html',
    styleUrls: ['./salaries-salaries-details-container.component.scss'],
    providers: [provideBreadcrumb('BREADCRUMBS_PAYROLL', 1)],
    standalone: false
})
export class SalariesSalariesDetailsContainerComponent
  implements OnInit, AfterViewInit
{
  textShow;

  initDate: string;

  constructor(
    public salariesDashboardSalariesFacade: SalariesDashboardSalariesFacade,
    public langFacade: LangFacade,
    public workPeriodFacade: DashboardWorkPeriodFacade,
    private route: ActivatedRoute,
    @Inject(BREADCRUMB) private _: unknown
  ) {}

  ngOnInit(): void {
    const currentDate = new Date();
    this.initDate =
      this.route.snapshot.queryParamMap.get('date') ||
      new Date(
        Date.UTC(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        )
      ).toISOString();
  }

  ngAfterViewInit(): void {
    this.workPeriodFacade.getWorkPeriods();

    if (!this.salariesDashboardSalariesFacade.getData()) {
      this.workPeriodDateUpdate(this.initDate);
    }
  }

  workPeriodDateUpdate(data: string): void {
    this.salariesDashboardSalariesFacade.getSalary(data);
  }

  textDisplayChange(): void {
    this.textShow = !this.textShow;
  }
}
