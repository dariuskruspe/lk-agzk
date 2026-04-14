import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import {
  AgreementEmployeeFilterInterface,
  AgreementsEmployeeInterface,
} from '../models/agreement-employee.interface';
import { AgreementsEmployeeService } from '../services/agreements-employee.service';
// todo delete
@Injectable({
  providedIn: 'root',
})
export class AbstractAgreementEmployeeListState {
  public entityName = 'agreementsEmployeeList';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getAgreementsEmployeeList,
    },
  };

  constructor(protected agreementsEmployeeService: AgreementsEmployeeService) {}

  getAgreementsEmployeeList(params: {
    currentEmployeeId: string;
    filterData?: AgreementEmployeeFilterInterface;
  }): Observable<AgreementsEmployeeInterface> {
    return this.agreementsEmployeeService.getAgreementsEmployeeLists(params);
  }
}
