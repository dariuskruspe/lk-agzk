import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { DashboardVacationReportsInterface } from '../models/dashboard-vacation-reports.interface';
import { DashboardVacationReportsState } from '../states/dashboard-vacation-reports.state';

@Injectable({
  providedIn: 'root',
})
export class DashboardVacationReportsFacade extends AbstractFacade<{
  reports: DashboardVacationReportsInterface[];
}> {
  constructor(
    protected geRx: GeRx,
    protected store: DashboardVacationReportsState,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getReports(): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.exception(currentEmployeeId);
  }
}
