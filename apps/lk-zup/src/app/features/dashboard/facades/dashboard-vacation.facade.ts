import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { DashboardVacationInterface } from '../models/dashboard-vacation.interface';
import { DashboardVacationState } from '../states/dashboard-vacation.state';

@Injectable({
  providedIn: 'root',
})
export class DashboardVacationFacade extends AbstractFacade<DashboardVacationInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: DashboardVacationState,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getVacations(): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.exception(currentEmployeeId);
  }
}
