import { Injectable } from '@angular/core';
import { DashboardBusinessTripsInterface } from '@features/dashboard/models/dashboard-business-trips.interface';
import { DashboardBusinessTripsState } from '@features/dashboard/states/dashboard-business-trips.state';
import { AbstractFacade } from '@shared/classes/abstractions/abstract.facade';
import { GeRx } from 'gerx';

@Injectable({
  providedIn: 'root',
})
export class DashboardBusinessTripsFacade extends AbstractFacade<
  DashboardBusinessTripsInterface[]
> {
  constructor(
    protected geRx: GeRx,
    protected store: DashboardBusinessTripsState
  ) {
    super(geRx, store);
  }

  getBusinessTrips(): void {
    this.exception();
  }
}
