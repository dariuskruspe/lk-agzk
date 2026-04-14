import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { EmployeesService } from '../services/employees.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeesSubordinatesStates {
  public entityName = 'employeeSubordinates';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.employeesStaticDataService.getSubordinates.bind(
        this.employeesStaticDataService
      ),
    },
  };

  constructor(private employeesStaticDataService: EmployeesService) {}
}
