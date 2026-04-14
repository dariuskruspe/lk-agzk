import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { DashboardVacationTotalInterface } from '../models/dashboard-vacation.interface';
import { DashboardVacationTotalState } from '../states/dashboard-vacation-total.state';

@Injectable({
  providedIn: 'root',
})
export class DashboardVacationTotalFacade extends AbstractFacade<DashboardVacationTotalInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: DashboardVacationTotalState,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getTotalDays(): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.exception(currentEmployeeId);
  }

  getTotalDaysDate(date: string): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.show({ currentEmployeeId, date });
  }
}
