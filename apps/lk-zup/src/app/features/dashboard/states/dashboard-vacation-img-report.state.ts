import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { DashboardVacationImgReportService } from '../services/dashboard-vacation-img-report.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardVacationImgReportState {
  public entityName = 'dashboardVacationImgReport';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.dashboardVacationImgReportService.showVacationImgReport.bind(
        this.dashboardVacationImgReportService
      ),
    },
  };

  constructor(
    private dashboardVacationImgReportService: DashboardVacationImgReportService
  ) {}
}
