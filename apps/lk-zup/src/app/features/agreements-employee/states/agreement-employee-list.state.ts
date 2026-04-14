import { Injectable } from '@angular/core';
import { AgreementsEmployeeService } from '../services/agreements-employee.service';
import { AbstractAgreementEmployeeListState } from './abstract-agreement-employee-list.state';
// todo delete
@Injectable({
  providedIn: 'root',
})
export class AgreementsEmployeeListState extends AbstractAgreementEmployeeListState {
  public entityName = 'agreementsEmployeeList';

  constructor(protected agreementsEmployeeService: AgreementsEmployeeService) {
    super(agreementsEmployeeService);
  }
}
