import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { AsyncBreadcrumbInterface } from '../../../shared/models/async-breadcrumb.interface';
import { EmployeePersonalDataInterface } from '../models/employees-personal-data.interface';
import { EmployeesCompanyProfileState } from '../states/employees-company-profile.state';

@Injectable({
  providedIn: 'root',
})
export class EmployeesCompanyProfileFacade
  extends AbstractFacade<EmployeePersonalDataInterface>
  implements AsyncBreadcrumbInterface
{
  constructor(
    protected geRx: GeRx,
    protected store: EmployeesCompanyProfileState
  ) {
    super(geRx, store);
  }

  getEmployeeProfile(employeeId: string): void {
    this.geRx.show(this.store.entityName, employeeId);
  }

  getLabel$(): Observable<string> {
    return this.getData$().pipe(map((v) => v?.fullName));
  }
}
