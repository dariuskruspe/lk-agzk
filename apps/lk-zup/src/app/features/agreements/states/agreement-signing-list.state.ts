import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';
import { AgreementFileInterface } from '../models/agreement.interface';
import { DocumentApiService } from '../services/document-api.service';

@Injectable({
  providedIn: 'root',
})
export class AgreementSigningListState {
  public entityName = 'agreementSigningList';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.showDocumentsList,
    },
  };

  constructor(private documentAPI: DocumentApiService) {}

  showDocumentsList(files: AgreementFileInterface[]): Observable<AgreementFileInterface[]> {
    return of(files);
  }
}
