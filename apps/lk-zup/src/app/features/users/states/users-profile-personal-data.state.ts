import { Injectable } from '@angular/core';
import { UserPersonalDataInterface } from '@features/users/models/user-personal-data.interface';
import { GeRxMethods } from 'gerx/index.interface';
import { EmployeesService } from '../../employees/services/employees.service';

@Injectable({
  providedIn: 'root',
})
export class UsersProfilePersonalDataState {
  public entityName = 'setPersonalData';

  personalData: UserPersonalDataInterface;

  public geRxMethods: GeRxMethods = {
    exception: {
      main: this.employeesPersonalDataService.showEmployeeId.bind(
        this.employeesPersonalDataService
      ),
    },
  };

  constructor(private employeesPersonalDataService: EmployeesService) {}
}
