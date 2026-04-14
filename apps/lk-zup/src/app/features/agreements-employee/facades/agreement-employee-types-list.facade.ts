import { Injectable } from '@angular/core';
import { AbstractFacade } from '@shared/classes/abstractions/abstract.facade';
import { GeRx } from 'gerx';
import { AgreementEmployeeDocumentTypesInterface } from '../models/agreement-employee.interface';
import { AgreementsEmployeeTypesListState } from '../states/agreement-employee-types-list.state';

@Injectable({
  providedIn: 'root',
})
export class AgreementEmployeeTypesListFacade extends AbstractFacade<AgreementEmployeeDocumentTypesInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: AgreementsEmployeeTypesListState
  ) {
    super(geRx, store);
  }

  getDocumentTypes(): void {
    this.exception();
  }
}
