import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { SalariesDashboardIncomeInterface } from '../models/salaries-dashboard-income.interface';
import { SalariesDashboardIncomeState } from '../states/salaries-dashboard-income.state';

@Injectable({
  providedIn: 'root',
})
export class SalariesDashboardIncomeFacade extends AbstractFacade<SalariesDashboardIncomeInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: SalariesDashboardIncomeState,
    private localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getPayslipIncome(): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.geRx.show(this.store.entityName, currentEmployeeId);
  }
}
