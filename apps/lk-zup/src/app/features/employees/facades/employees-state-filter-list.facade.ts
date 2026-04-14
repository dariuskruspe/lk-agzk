import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { EmployeeStateListInterface } from '../models/employees.interface';
import { EmployeesStateFilterListState } from '../states/employees-state-filter-list.state';

@Injectable({
  providedIn: 'root',
})
export class EmployeesStateFilterListFacade extends AbstractFacade<EmployeeStateListInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: EmployeesStateFilterListState
  ) {
    super(geRx, store);
  }

  getStateFilterList(): void {
    this.geRx.show(this.store.entityName);
  }
}
