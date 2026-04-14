import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { BusinessTripsDocumentFieldsState } from '../states/business-trips-document-fields.state';

@Injectable({
  providedIn: 'root',
})
export class BusinessTripsDocumentFieldsFacade extends AbstractFacade<{
  fields: { [key: string]: string | number };
}> {
  constructor(
    protected geRx: GeRx,
    protected store: BusinessTripsDocumentFieldsState
  ) {
    super(geRx, store);
  }

  getDocumentFields(
    issueTypeId: string,
    typeId: string,
    documentId: string
  ): void {
    this.geRx.show(this.store.entityName, {
      issueId: issueTypeId,
      typeId,
      documentId,
    });
  }
}
