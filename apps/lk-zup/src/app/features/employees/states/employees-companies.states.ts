import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { EmployeesCompaniesInterface } from '../models/employees-company.interface';
import { EmployeesCompanyService } from '../services/employees-company.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeesCompaniesState {
  public entityName = 'employeesCompanies';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getCompanies,
    },
  };

  constructor(private employeesCompanyService: EmployeesCompanyService) {}

  getCompanies(): Observable<EmployeesCompaniesInterface> {
    return this.employeesCompanyService.getCompanies();
  }
}
