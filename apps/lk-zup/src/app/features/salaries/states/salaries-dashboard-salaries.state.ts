import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { SalariesDashboardSalariesService } from '../services/salaries-dashboard-salaries.service';

@Injectable({
  providedIn: 'root',
})
export class SalariesDashboardSalariesState {
  public entityName = 'payslipDashboard';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.dashboardSalaryService.getPayslip.bind(
        this.dashboardSalaryService
      ),
    },
  };

  constructor(
    private dashboardSalaryService: SalariesDashboardSalariesService
  ) {}
}
