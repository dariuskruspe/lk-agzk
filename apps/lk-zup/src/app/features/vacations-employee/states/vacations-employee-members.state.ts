import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { StateInterface } from '../../../shared/models/state.interface';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { EmployeeInterface } from '../models/vacations.interface';
import { VacationsEmployeeService } from '../sevices/vacations-employee.service';

@Injectable({
  providedIn: 'root',
})
export class VacationsEmployeeMembersState implements StateInterface {
  public entityName = 'vacationsEmployeeMembersState';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getMembers,
    },
  };

  constructor(
    private vacationsEmployeeService: VacationsEmployeeService,
    protected localstorageService: LocalStorageService
  ) {}

  getMembers(param: {
    name?: string;
    date?: Date;
  }): Observable<EmployeeInterface[]> {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    return this.vacationsEmployeeService.getMembers(
      currentEmployeeId,
      param?.name,
      param?.date
    );
  }
}
