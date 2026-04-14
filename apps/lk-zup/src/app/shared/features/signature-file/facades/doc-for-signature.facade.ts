import { Injectable } from '@angular/core';
import { DocumentInterface } from '@features/agreements/models/document.interface';
import { AbstractFacade } from '@shared/classes/abstractions/abstract.facade';
import { DocForSignatureState } from '@shared/features/signature-file/states/doc-for-signature.state';
import { GeRx } from 'gerx';

@Injectable({
  providedIn: 'root',
})
export class DocForSignatureFacade extends AbstractFacade<DocumentInterface> {
  constructor(protected geRx: GeRx, protected store: DocForSignatureState) {
    super(geRx, store);
  }

  getDocument(data: DocumentInterface): void {
    if (data && !Object.keys(data).includes('providers')) {
      this.geRx.edit(this.store.entityName, data);
    } else {
      this.geRx.show(this.store.entityName, data);
    }
  }
}
