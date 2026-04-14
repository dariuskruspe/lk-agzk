import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { DashboardPopularRequestsInterface } from '../models/dashboard-popular-requests.interface';
import { DashboardPopularRequestsState } from '../states/dashboard-popular-requests.state';

@Injectable({
  providedIn: 'root',
})
export class DashboardPopularRequestsFacade extends AbstractFacade<DashboardPopularRequestsInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: DashboardPopularRequestsState
  ) {
    super(geRx, store);
  }

  getPopularRequests(): void {
    this.geRx.exception(this.store.entityName);
  }
}
