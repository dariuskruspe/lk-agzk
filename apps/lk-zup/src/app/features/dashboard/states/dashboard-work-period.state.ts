import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { DashboardSalaryService } from '../services/dashboard-salary.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardWorkPeriodState {
  public entityName = 'workPeriod';

  public geRxMethods: GeRxMethods = {
    exception: {
      main: this.dashboardSalaryService.getWorkPeriods.bind(
        this.dashboardSalaryService
      ),
    },
  };

  constructor(private dashboardSalaryService: DashboardSalaryService) {}
}
