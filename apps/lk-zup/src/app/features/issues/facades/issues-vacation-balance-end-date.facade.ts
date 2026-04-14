import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { IssuesVacationBalanceEndDateState } from '../states/issues-vacation-balance-end-date.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesVacationBalanceEndDateFacade extends AbstractFacade<unknown> {
  constructor(
    protected geRx: GeRx,
    protected store: IssuesVacationBalanceEndDateState,
    private localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  vacationBalanceByDate(date: Date): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.geRx.show(this.store.entityName, { currentEmployeeId, date });
  }
}
