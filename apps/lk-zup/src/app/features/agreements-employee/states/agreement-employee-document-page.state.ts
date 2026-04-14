import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AgreementEmployeeDocumentPageInterface,
  AgreementEmployeeDocumentPageReqInterface,
} from '../models/agreement-employee-document-page.interface';
import { AgreementsEmployeeDocumentPageService } from '../services/agreements-employee-document-page.service';

@Injectable({
  providedIn: 'root',
})
export class AgreementEmployeeDocumentPageState {
  public entityName = 'agreementEmployeePage';

  public dialogRef;

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getDocumentPage,
    },
  };

  constructor(
    private agreementsEmployeeDocumentPageService: AgreementsEmployeeDocumentPageService
  ) {}

  getDocumentPage(
    data: AgreementEmployeeDocumentPageReqInterface
  ): Observable<AgreementEmployeeDocumentPageInterface> {
    return this.agreementsEmployeeDocumentPageService
      .getDocumentPage(data)
      .pipe(map((result) => ({ ...result, forEmployee: data.forEmployee })));
  }
}
