import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { EmployeeStateListInterface } from '../models/employees.interface';
import { EmployeesStateListState } from '../states/employees-state-list.state';

@Injectable({
  providedIn: 'root',
})
export class EmployeesStateListFacade extends AbstractFacade<EmployeeStateListInterface> {
  constructor(protected geRx: GeRx, protected store: EmployeesStateListState) {
    super(geRx, store);
  }

  getStateList(): void {
    this.geRx.show(this.store.entityName);
  }
}
