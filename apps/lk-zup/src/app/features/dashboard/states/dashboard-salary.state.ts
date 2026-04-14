import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { DashboardSalaryService } from '../services/dashboard-salary.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardSalaryState {
  public entityName = 'payslip';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.dashboardSalaryService.getPayslip.bind(
        this.dashboardSalaryService
      ),
    },
  };

  constructor(private dashboardSalaryService: DashboardSalaryService) {}
}
