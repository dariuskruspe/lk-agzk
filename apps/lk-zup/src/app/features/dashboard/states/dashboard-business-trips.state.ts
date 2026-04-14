import { Injectable } from '@angular/core';
import { DashboardBusinessTripsService } from '@features/dashboard/services/dashboard-business-trips.service';
import { GeRxMethods } from 'gerx/index.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardBusinessTripsState {
  public entityName = 'dashboardBusinessTrips';

  public geRxMethods: GeRxMethods = {
    exception: {
      main: this.dashboardBusinessTripsService.getBusinessTrips.bind(
        this.dashboardBusinessTripsService
      ),
    },
  };

  constructor(
    protected dashboardBusinessTripsService: DashboardBusinessTripsService
  ) {}
}
