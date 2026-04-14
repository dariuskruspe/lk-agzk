import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { IssuesCompensationIdState } from '../states/issues-compensation-id.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesCompensationIdFacade extends AbstractFacade<unknown> {
  constructor(
    protected geRx: GeRx,
    protected store: IssuesCompensationIdState,
    private localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  vacationBalanceByTypesId(): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.geRx.show(this.store.entityName, currentEmployeeId);
  }
}
