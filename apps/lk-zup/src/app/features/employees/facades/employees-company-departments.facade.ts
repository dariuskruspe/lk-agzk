import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { EmployeesCompanyDepartmentsInterface } from '../models/employees-company.interface';
import { EmployeesCompanyDepartmentsStates } from '../states/employees-company-departments.states';

@Injectable({
  providedIn: 'root',
})
export class EmployeesCompanyDepartmentsFacade extends AbstractFacade<
  EmployeesCompanyDepartmentsInterface[]
> {
  constructor(
    protected geRx: GeRx,
    protected store: EmployeesCompanyDepartmentsStates,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getDepartments(): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.geRx.show(this.store.entityName, currentEmployeeId);
  }
}
