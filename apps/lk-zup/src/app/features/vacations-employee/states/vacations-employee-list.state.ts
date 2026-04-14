import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { StateInterface } from '../../../shared/models/state.interface';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { EmployeeListItemInterface } from '../models/vacations.interface';
import { VacationsEmployeeService } from '../sevices/vacations-employee.service';

@Injectable({
  providedIn: 'root',
})
export class VacationsEmployeeListState implements StateInterface {
  public entityName = 'vacationsEmployeeListState';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getEmployees,
    },
  };

  constructor(
    public vacationsEmployeeService: VacationsEmployeeService,
    protected localstorageService: LocalStorageService
  ) {}

  getEmployees(): Observable<EmployeeListItemInterface[]> {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    return this.vacationsEmployeeService.getEmployees(currentEmployeeId);
  }
}
