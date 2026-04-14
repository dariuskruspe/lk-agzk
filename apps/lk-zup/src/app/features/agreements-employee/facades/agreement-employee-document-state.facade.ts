import { Injectable } from '@angular/core';
import { AbstractFacade } from '@shared/classes/abstractions/abstract.facade';
import { GeRx } from 'gerx';
import { AgreementsEmployeeDocumentStateInterface } from '../models/agreements-employee-document-state.interface';
import { AgreementEmployeeDocumentStatesState } from '../states/agreement-employee-document-states.state';

@Injectable({
  providedIn: 'root',
})
export class AgreementEmployeeDocumentStateFacade extends AbstractFacade<AgreementsEmployeeDocumentStateInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: AgreementEmployeeDocumentStatesState
  ) {
    super(geRx, store);
  }

  getState(): void {
    this.show();
  }
}
