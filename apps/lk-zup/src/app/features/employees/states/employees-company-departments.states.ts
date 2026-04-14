import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmployeesCompanyDepartmentsInterface } from '../models/employees-company.interface';
import { EmployeesCompanyService } from '../services/employees-company.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeesCompanyDepartmentsStates {
  public entityName = 'employeesCompanyDepartments';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getDepartments,
    },
  };

  constructor(private employeesCompanyService: EmployeesCompanyService) {}

  getDepartments(): Observable<EmployeesCompanyDepartmentsInterface[]> {
    return this.employeesCompanyService
      .getDepartments()
      .pipe(map((result) => result.departments));
  }
}
