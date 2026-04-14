import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { DocumentListInterface } from '../models/agreement.interface';
import { DocumentApiService } from '../services/document-api.service';

@Injectable({
  providedIn: 'root',
})
// Стор используется на этой же странице поэтому сделан в отдельной сущности (не объеденять!)
export class UnsignedAgreementsState {
  public entityName = 'unsignedDocuments';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getUnsignedAgreementsList,
      success: this.successHasUnsignedAgreementsList,
    },
  };

  constructor(
    private documentAPI: DocumentApiService,
    private localstorageService: LocalStorageService
  ) {}

  getUnsignedAgreementsList(data: {
    currentEmployeeId: string;
    docUnsignedStates: string[];
  }): Observable<DocumentListInterface> {
    return this.documentAPI.getUnsignedAgreementsList(data);
  }

  successHasUnsignedAgreementsList(res: DocumentListInterface): Observable<void> {
    this.localstorageService.setHasUnsignedDocuments(res.documents.length);
    return of();
  }
}
