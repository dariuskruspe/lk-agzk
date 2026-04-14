import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { SalariesDashboardIncomeService } from '../services/salaries-dashboard-income.service';

@Injectable({
  providedIn: 'root',
})
export class SalariesDashboardIncomeState {
  public entityName = 'incomeDashboard';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.dashboardIncomeService.getPayslipIncome.bind(
        this.dashboardIncomeService
      ),
    },
  };

  constructor(private dashboardIncomeService: SalariesDashboardIncomeService) {}
}
