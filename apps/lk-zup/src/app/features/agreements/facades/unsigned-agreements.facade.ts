import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { DocumentListInterface } from '../models/agreement.interface';
import { UnsignedAgreementsState } from '../states/agreement-unsigned.state';

@Injectable({
  providedIn: 'root',
})
export class UnsignedAgreementsFacade extends AbstractFacade<DocumentListInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: UnsignedAgreementsState,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getUnsignedDocumentsList(docUnsignedStates: string[]): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.show({
      currentEmployeeId,
      docUnsignedStates,
    });
  }
}
