import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { IssuesVacationBalanceState } from '../states/issues-vacation-balance.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesVacationBalanceFacade extends AbstractFacade<unknown> {
  constructor(
    protected geRx: GeRx,
    protected store: IssuesVacationBalanceState,
    private localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  vacationBalance(): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.geRx.show(this.store.entityName, currentEmployeeId);
  }
}
