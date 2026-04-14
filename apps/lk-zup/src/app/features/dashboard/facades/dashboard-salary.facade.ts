import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { DashboardPayslipInterface } from '../models/dashboard-payslip.interface';
import { DashboardSalaryState } from '../states/dashboard-salary.state';

@Injectable({
  providedIn: 'root',
})
export class DashboardSalaryFacade extends AbstractFacade<DashboardPayslipInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: DashboardSalaryState,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getSalary(date: string): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.show({ date, currentEmployeeId });
  }
}
