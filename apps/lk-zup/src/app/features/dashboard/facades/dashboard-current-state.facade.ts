import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { DashboardCurrentStateInterface } from '../models/dashboard-current-state.interface';
import { DashboardCurrentStateState } from '../states/dashboard-current-state.state';

@Injectable({
  providedIn: 'root',
})
export class DashboardCurrentStateFacade extends AbstractFacade<DashboardCurrentStateInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: DashboardCurrentStateState,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getCurrentState(): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.geRx.exception(this.store.entityName, currentEmployeeId);
  }
}
