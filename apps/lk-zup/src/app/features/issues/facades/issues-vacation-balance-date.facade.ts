import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { IssuesVacationBalanceDateState } from '../states/issues-vacation-balance-date.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesVacationBalanceDateFacade extends AbstractFacade<unknown> {
  constructor(
    protected geRx: GeRx,
    protected store: IssuesVacationBalanceDateState,
    private localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  vacationBalanceByDate(date: Date): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.geRx.show(this.store.entityName, { currentEmployeeId, date });
  }
}
