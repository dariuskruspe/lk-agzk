import { Injectable } from '@angular/core';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { GeRx } from 'gerx';
import { AgreementsEmployeeListState } from '../states/agreement-employee-list.state';
import { AbstractAgreementEmployeeListFacade } from './abstract-agreement-employee-list.facade';

@Injectable({
  providedIn: 'root',
})
export class AgreementEmployeeListFacade extends AbstractAgreementEmployeeListFacade {
  constructor(
    protected geRx: GeRx,
    protected store: AgreementsEmployeeListState,
    protected localStorageService: LocalStorageService
  ) {
    super(geRx, store, localStorageService);
  }
}
