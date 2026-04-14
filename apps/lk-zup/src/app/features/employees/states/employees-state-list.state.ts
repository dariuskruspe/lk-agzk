import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { EmployeeStateListInterface } from '../models/employees.interface';
import { EmployeesService } from '../services/employees.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeesStateListState {
  public entityName = 'employeeStateList';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getStateList,
    },
  };

  constructor(private employeesService: EmployeesService) {}

  getStateList(): Observable<EmployeeStateListInterface> {
    return this.employeesService.getStateList();
  }
}
