import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { SalariesDashboardSalariesInterface } from '../models/salaries-dashboard-salaries.interface';
import { SalariesDashboardSalariesState } from '../states/salaries-dashboard-salaries.state';

@Injectable({
  providedIn: 'root',
})
export class SalariesDashboardSalariesFacade extends AbstractFacade<SalariesDashboardSalariesInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: SalariesDashboardSalariesState,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getSalary(date: string): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.geRx.show(this.store.entityName, { date, currentEmployeeId });
  }
}
