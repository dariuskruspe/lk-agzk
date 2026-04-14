import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { EmployeesService } from '../services/employees.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeesStaticDataStates {
  public entityName = 'employeeStaticData';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.employeesStaticDataService.getStaticData.bind(
        this.employeesStaticDataService
      ),
    },
  };

  constructor(private employeesStaticDataService: EmployeesService) {}
}
