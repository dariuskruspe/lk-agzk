import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { DashboardCurrentStateService } from '../services/dashboard-current-state.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardCurrentStateState {
  public entityName = 'currentState';

  public geRxMethods: GeRxMethods = {
    exception: {
      main: this.dashboardCurrentStateService.getStatus.bind(
        this.dashboardCurrentStateService
      ),
    },
  };

  constructor(
    private dashboardCurrentStateService: DashboardCurrentStateService
  ) {}
}
