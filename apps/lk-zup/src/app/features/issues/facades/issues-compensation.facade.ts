import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { IssuesCompensationState } from '../states/issues-compensation.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesCompensationFacade extends AbstractFacade<unknown> {
  constructor(
    protected geRx: GeRx,
    protected store: IssuesCompensationState,
    private localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  vacationBalanceByTypes(): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.geRx.show(this.store.entityName, currentEmployeeId);
  }
}
