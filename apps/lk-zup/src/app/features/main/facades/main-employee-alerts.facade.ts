import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { AlertsInterface } from '../models/alerts.interface';
import { MainEmployeeAlertsState } from '../states/main-employee-alerts.state';

@Injectable({
  providedIn: 'root',
})
export class MainEmployeeAlertsFacade extends AbstractFacade<AlertsInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: MainEmployeeAlertsState,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getAlerts(): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.geRx.exception(this.store.entityName, currentEmployeeId);
  }
}
