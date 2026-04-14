import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import {
  DocumentFilterInterface,
  DocumentListInterface,
} from '../models/agreement.interface';
import { DocumentApiService } from '../services/document-api.service';
// todo delete
@Injectable({
  providedIn: 'root',
})
export class AbstractDocumentListState {
  public entityName = 'documentList';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getAgreementsList,
    },
  };

  constructor(protected documentAPI: DocumentApiService) {}

  getAgreementsList(params: {
    currentEmployeeId: string;
    filterData?: DocumentFilterInterface;
  }): Observable<DocumentListInterface> {
    return this.documentAPI.getDocumentList(params);
  }
}
