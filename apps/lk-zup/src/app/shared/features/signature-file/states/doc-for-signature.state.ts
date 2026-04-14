import { Injectable } from '@angular/core';
import {
  DocumentInterface,
  GetDocumentParamsInterface,
} from '@features/agreements/models/document.interface';
import { DocumentApiService } from '@features/agreements/services/document-api.service';
import { SignatureFileFacade } from '@shared/features/signature-file/facades/signature-file.facade';
import { DocSignatureInterface } from '@shared/features/signature-file/models/doc-signature.interface';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocForSignatureState {
  public entityName = 'docForSignatureState';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.setExistingDocument,
      success: this.getFile,
    },
    edit: {
      main: this.getDocument,
      success: this.getFile,
    },
  };

  constructor(
    private documentAPI: DocumentApiService,
    private fileFacade: SignatureFileFacade,
    private localStorageService: LocalStorageService
  ) {}

  setExistingDocument(
    data: DocSignatureInterface
  ): Observable<DocSignatureInterface> {
    return of(data);
  }

  getDocument(
    params: GetDocumentParamsInterface
  ): Observable<DocumentInterface> {
    if (!params.currentEmployeeId)
      params.currentEmployeeId =
        this.localStorageService.getCurrentEmployeeId();

    return this.documentAPI.getDocument(params);
  }

  getFile(data: DocSignatureInterface): Observable<void> {
    this.fileFacade.show(data);
    return of();
  }
}
