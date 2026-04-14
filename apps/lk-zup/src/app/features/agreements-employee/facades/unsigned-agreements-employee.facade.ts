import { Injectable } from '@angular/core';
import { AbstractFacade } from '@shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { GeRx } from 'gerx';
import { AgreementsEmployeeInterface } from '../models/agreement-employee.interface';
import { UnsignedAgreementsEmployeeState } from '../states/agreement-employee-unsigned.state';

@Injectable({
  providedIn: 'root',
})
export class UnsignedAgreementsEmployeeFacade extends AbstractFacade<AgreementsEmployeeInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: UnsignedAgreementsEmployeeState,
    protected localstorageService: LocalStorageService,
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
