import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { DashboardVacationService } from '../services/dashboard-vacation.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardVacationState {
  public entityName = 'vacationArray';

  public geRxMethods: GeRxMethods = {
    exception: {
      main: this.dashboardVacationService.getVacationArray.bind(
        this.dashboardVacationService
      ),
    },
  };

  constructor(private dashboardVacationService: DashboardVacationService) {}
}
