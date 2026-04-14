import { Injectable } from '@angular/core';
import { DocumentTypesInterface } from '@features/agreements/models/agreement.interface';
import { DocumentTypeListState } from '@features/agreements/states/document-type-list.state';
import { AbstractFacade } from '@shared/classes/abstractions/abstract.facade';
import { GeRx } from 'gerx';

@Injectable({
  providedIn: 'root',
})
export class DocumentTypeListFacade extends AbstractFacade<DocumentTypesInterface> {
  constructor(protected geRx: GeRx, protected store: DocumentTypeListState) {
    super(geRx, store);
  }

  getDocumentTypes(): void {
    this.exception();
  }
}
