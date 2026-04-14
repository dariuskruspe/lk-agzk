import { Injectable } from '@angular/core';
import { AbstractFacade } from '@shared/classes/abstractions/abstract.facade';
import { GeRx } from 'gerx';
import { AgreementEmployeeFileInterface } from '../models/agreement-employee.interface';
import { AgreementEmployeeSigningListState } from '../states/agreement-employee-signing-list.state';

@Injectable({
  providedIn: 'root',
})
export class AgreementEmployeeSigningListFacade extends AbstractFacade<
  AgreementEmployeeFileInterface[]
> {
  constructor(
    protected geRx: GeRx,
    protected store: AgreementEmployeeSigningListState
  ) {
    super(geRx, store);
  }
}
