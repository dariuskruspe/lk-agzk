import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { IssuesDayOffState } from '../states/issues-day-off.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesDayOffFacade extends AbstractFacade<{
  employeeID: string;
  date: string;
  isDayOff: boolean;
}> {
  constructor(
    protected geRx: GeRx,
    protected store: IssuesDayOffState,
    private localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getDaysOff(date: string): void {
    const convertDate = new Date(date);
    const utcDate = new Date(
      Date.UTC(
        convertDate.getFullYear(),
        convertDate.getMonth(),
        convertDate.getDate()
      )
    );
    if (convertDate.getFullYear() >= new Date().getFullYear()) {
      const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
      this.geRx.exception(this.store.entityName, {
        currentEmployeeId,
        date: utcDate.toISOString(),
      });
    }
  }
}
