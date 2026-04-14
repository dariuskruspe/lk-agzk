import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { VacationsApprovalState } from '../states/vacations-approval.state';

@Injectable({
  providedIn: 'root',
})
export class VacationsApprovalFacade extends AbstractFacade<void> {
  constructor(protected geRx: GeRx, protected store: VacationsApprovalState) {
    super(geRx, store);
  }
}
