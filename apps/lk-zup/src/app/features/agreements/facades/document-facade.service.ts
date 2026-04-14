import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentFilterInterface } from '@features/agreements/models/agreement.interface';
import {
  DocumentInterface,
  GetDocumentParamsInterface,
} from '@features/agreements/models/document.interface';
import { DocumentState } from '@features/agreements/states/document-state.service';
import { AbstractFacade } from '@shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { GeRx } from 'gerx';
import { isNil } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class DocumentFacade extends AbstractFacade<DocumentInterface> {
  protected additionalParams: DocumentFilterInterface = {};

  constructor(
    protected geRx: GeRx,
    protected store: DocumentState,
    private router: Router,
    private localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getDocument(params: GetDocumentParamsInterface): void {
    if (isNil(params.forEmployee))
      params.forEmployee = this.router.url.split('/')[1] !== 'documents';

    if (!params.currentEmployeeId)
      params.currentEmployeeId =
        this.localstorageService.getCurrentEmployeeId();

    this.geRx.show(this.store.entityName, params);
  }

  setAdditionalParams(params: DocumentFilterInterface): void {
    this.additionalParams = params;
  }
}
