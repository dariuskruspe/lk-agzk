import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
// eslint-disable-next-line import/no-extraneous-dependencies
import mime from 'mime';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  EmployeesCompanyEmployeeListFormFilter,
  EmployeesCompanyEmployeeListInterface,
} from '../models/employees-company-employee-list.interface';
import { EmployeesCompanyService } from '../services/employees-company.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeesCompanyEmployeeListStates {
  public entityName = 'employeesCompanyEmployeeList';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getEmployeeList,
    },
  };

  constructor(private employeesCompanyService: EmployeesCompanyService) {}

  getEmployeeList(
    filterData: EmployeesCompanyEmployeeListFormFilter
  ): Observable<EmployeesCompanyEmployeeListInterface> {
    return this.employeesCompanyService.getEmployeeList(filterData).pipe(
      map((result) => {
        return {
          ...result,
          employees: result.employees.map((employee) => {
            if (!employee.photo && employee.imageExt && employee.image64) {
              const imageExtension = employee.imageExt;

              const imageMimeType = mime.getType(imageExtension);

              const { image64 } = employee;

              const avatar: string = `data:${imageMimeType};base64,${image64}`;
              return {
                ...employee,
                photo: avatar,
              };
            } else return employee;
          }),
        };
      })
    );
  }
}
