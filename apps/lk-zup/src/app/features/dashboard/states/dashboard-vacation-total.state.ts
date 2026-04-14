import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { DashboardVacationService } from '../services/dashboard-vacation.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardVacationTotalState {
  public entityName = 'vacationTotal';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.dashboardVacationService.getVacationTotalDate.bind(
        this.dashboardVacationService
      ),
    },
    exception: {
      main: this.dashboardVacationService.getVacationTotal.bind(
        this.dashboardVacationService
      ),
    },
  };

  constructor(private dashboardVacationService: DashboardVacationService) {}
}
