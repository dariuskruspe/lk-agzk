import { Injectable } from '@angular/core';
import { AgreementEmployeeFileInterface } from '@features/agreements-employee/models/agreement-employee.interface';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { AgreementsEmployeeService } from '../services/agreements-employee.service';

@Injectable({
  providedIn: 'root',
})
export class AgreementEmployeeSigningListState {
  public entityName = 'agreementEmployeeSigningList';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.showDocumentsList,
    },
  };

  constructor(private agreementsEmployeeService: AgreementsEmployeeService) {}

  showDocumentsList(
    ids: string[]
  ): Observable<AgreementEmployeeFileInterface[]> {
    return this.agreementsEmployeeService.getAgreementsEmployeeFilesList(ids);
  }
}
