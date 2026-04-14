import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { QueryBuilder } from '../../../shared/classes/query-builder/query-builder';
import {
  EmployeesCompanyEmployeeListFormFilter,
  EmployeesCompanyEmployeeListInterface,
} from '../models/employees-company-employee-list.interface';
import {
  EmployeesCompaniesInterface,
  EmployeesCompanyInterface,
} from '../models/employees-company.interface';
import { EmployeePersonalDataInterface } from '../models/employees-personal-data.interface';

@Injectable({
  providedIn: 'root',
})
export class EmployeesCompanyService {
  constructor(private http: HttpClient) {}

  getDepartments(): Observable<EmployeesCompanyInterface> {
    return this.http.get<EmployeesCompanyInterface>(
      `${Environment.inv().api}/wa_company/departments`
    );
  }

  getCompanies(): Observable<EmployeesCompaniesInterface> {
    return this.http.get<EmployeesCompaniesInterface>(
      `${Environment.inv().api}/wa_company/organizations`
    );
  }

  getEmployeeList(
    filterData: EmployeesCompanyEmployeeListFormFilter
  ): Observable<EmployeesCompanyEmployeeListInterface> {
    return this.http.get<EmployeesCompanyEmployeeListInterface>(
      `${Environment.inv().api}/wa_company/employeesList`,
      {
        params: QueryBuilder.queryBuilder(filterData),
      }
    );
  }

  getEmployeeProfile(
    employeeId: string
  ): Observable<EmployeePersonalDataInterface> {
    return this.http.get<EmployeePersonalDataInterface>(
      `${Environment.inv().api}/wa_company/employeeProfile/${employeeId}`
    );
  }
}
