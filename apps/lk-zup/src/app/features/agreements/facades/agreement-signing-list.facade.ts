import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { AgreementFileInterface } from '../models/agreement.interface';
import { AgreementSigningListState } from '../states/agreement-signing-list.state';

@Injectable({
  providedIn: 'root',
})
export class AgreementSigningListFacade extends AbstractFacade<
  AgreementFileInterface[]
> {
  constructor(
    protected geRx: GeRx,
    protected store: AgreementSigningListState
  ) {
    super(geRx, store);
  }
}
