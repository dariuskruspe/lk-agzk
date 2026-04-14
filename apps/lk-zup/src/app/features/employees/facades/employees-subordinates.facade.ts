import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { EmployeesSubordinatesInterface } from '../models/employees-subordinates.interface';
import { EmployeesSubordinatesStates } from '../states/employees-subordinates.states';

@Injectable({
  providedIn: 'root',
})
export class EmployeesSubordinatesFacade extends AbstractFacade<EmployeesSubordinatesInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: EmployeesSubordinatesStates,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getSubordinatesList(): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.geRx.show(this.store.entityName, currentEmployeeId);
  }
}
