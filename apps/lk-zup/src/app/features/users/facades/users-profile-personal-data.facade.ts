import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { EmployeesInterface } from '../../employees/models/employees.interface';
import { UsersProfilePersonalDataState } from '../states/users-profile-personal-data.state';

@Injectable({
  providedIn: 'root',
})
export class UsersProfilePersonalDataFacade extends AbstractFacade<EmployeesInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: UsersProfilePersonalDataState,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getPersonalData(employeeId?: string): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.geRx.exception(this.store.entityName, employeeId || currentEmployeeId);
  }
}
