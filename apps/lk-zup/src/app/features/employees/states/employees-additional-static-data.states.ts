import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { EmployeesService } from '../services/employees.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeesAdditionalStaticDataStates {
  public entityName = 'employeeAdditionalStaticData';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.employeesStaticDataService.updatingStaticData.bind(
        this.employeesStaticDataService
      ),
    },
  };

  constructor(private employeesStaticDataService: EmployeesService) {}
}
