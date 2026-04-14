import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { EmployeePersonalDataInterface } from '../models/employees-personal-data.interface';
import { EmployeesCompanyProfileDialogState } from '../states/employees-company-profile-dialog.state';

@Injectable({
  providedIn: 'root',
})
export class EmployeesCompanyProfileDialogFacade extends AbstractFacade<EmployeePersonalDataInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: EmployeesCompanyProfileDialogState
  ) {
    super(geRx, store);
  }

  getEmployeeProfile(employeeId: string): void {
    this.geRx.show(this.store.entityName, employeeId);
  }
}
