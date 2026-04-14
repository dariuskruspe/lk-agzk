import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { DashboardPopularRequestsService } from '../services/dashboard-popular-requests.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardPopularRequestsState {
  public entityName = 'popularRequests';

  public geRxMethods: GeRxMethods = {
    exception: {
      main: this.dashboardPopularRequestsService.getRequests.bind(
        this.dashboardPopularRequestsService
      ),
    },
  };

  constructor(
    private dashboardPopularRequestsService: DashboardPopularRequestsService
  ) {}
}
