import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import {
  EmployeesCompanyEmployeeListFormFilter,
  EmployeesCompanyEmployeeListInterface,
} from '../models/employees-company-employee-list.interface';
import { EmployeesCompanyEmployeeListStates } from '../states/employees-company-employee-list.states';

@Injectable({
  providedIn: 'root',
})
export class EmployeesCompanyEmployeeListFacade extends AbstractFacade<EmployeesCompanyEmployeeListInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: EmployeesCompanyEmployeeListStates
  ) {
    super(geRx, store);
  }

  getEmployeeList(filterData?: EmployeesCompanyEmployeeListFormFilter): void {
    this.geRx.show(this.store.entityName, filterData);
  }
}
