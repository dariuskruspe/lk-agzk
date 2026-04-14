import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { DashboardVacationReportsService } from '../services/dashboard-vacation-reports.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardVacationReportsState {
  public entityName = 'vacationReports';

  public geRxMethods: GeRxMethods = {
    exception: {
      main: this.dashboardVacationReportsService.getReports.bind(
        this.dashboardVacationReportsService
      ),
    },
  };

  constructor(
    private dashboardVacationReportsService: DashboardVacationReportsService
  ) {}
}
