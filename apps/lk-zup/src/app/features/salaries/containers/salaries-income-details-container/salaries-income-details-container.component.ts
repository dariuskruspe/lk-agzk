import { Component, Inject, OnInit } from '@angular/core';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '../../../main/utils/breadcrumb-provider.utils';
import { SalariesDashboardIncomeFacade } from '../../facades/salaries-dashboard-income.facade';

@Component({
    selector: 'app-salaries-income-details-container',
    templateUrl: './salaries-income-details-container.component.html',
    styleUrls: ['./salaries-income-details-container.component.scss'],
    providers: [provideBreadcrumb('BREADCRUMBS_AVERAGE_INCOME', 1)],
    standalone: false
})
export class SalariesIncomeDetailsContainerComponent implements OnInit {
  textShow = false;

  constructor(
    public salariesDashboardIncomeFacade: SalariesDashboardIncomeFacade,
    @Inject(BREADCRUMB) private _: unknown
  ) {}

  ngOnInit(): void {
    this.salariesDashboardIncomeFacade.getPayslipIncome();
  }

  textDisplayChange(): void {
    this.textShow = !this.textShow;
  }
}
