import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { DashboardWorkPeriodsInterface } from '../models/dashboard-work-periods.interface';
import { DashboardWorkPeriodState } from '../states/dashboard-work-period.state';

@Injectable({
  providedIn: 'root',
})
export class DashboardWorkPeriodFacade extends AbstractFacade<DashboardWorkPeriodsInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: DashboardWorkPeriodState,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getWorkPeriods(): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.exception(currentEmployeeId);
  }
}
