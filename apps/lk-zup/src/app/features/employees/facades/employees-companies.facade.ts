import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { EmployeesCompaniesInterface } from '../models/employees-company.interface';
import { EmployeesCompaniesState } from '../states/employees-companies.states';

@Injectable({
  providedIn: 'root',
})
export class EmployeesCompaniesFacade extends AbstractFacade<EmployeesCompaniesInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: EmployeesCompaniesState,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getCompanies(): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.geRx.show(this.store.entityName, currentEmployeeId);
  }
}
