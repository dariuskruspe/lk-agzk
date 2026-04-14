import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { EmployeePersonalDataInterface } from '../models/employees-personal-data.interface';
import { EmployeesCompanyService } from '../services/employees-company.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeesCompanyProfileState {
  public entityName = 'employeeProfile';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getEmployeeProfile,
    },
  };

  constructor(private employeesCompanyService: EmployeesCompanyService) {}

  getEmployeeProfile(
    employeeId: string
  ): Observable<EmployeePersonalDataInterface> {
    return this.employeesCompanyService.getEmployeeProfile(employeeId);
  }
}
