import { Injectable } from '@angular/core';
import { AgreementsEmployeeService } from '../services/agreements-employee.service';
import { AbstractAgreementEmployeeListState } from './abstract-agreement-employee-list.state';
// todo delete
@Injectable({
  providedIn: 'root',
})
export class MyDocumentsListState extends AbstractAgreementEmployeeListState {
  public entityName = 'myDocumentsList';

  constructor(protected agreementsEmployeeService: AgreementsEmployeeService) {
    super(agreementsEmployeeService);
  }
}
