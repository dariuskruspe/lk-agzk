import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import {
  IssuesManagementFilterInterface,
  IssuesManagementInterfaces,
} from '../models/issues-management-list.interfaces';
import { IssuesManagementListApprovingState } from '../states/issues-manegement-list-approving.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesManagementListApprovingFacade extends AbstractFacade<IssuesManagementInterfaces> {
  constructor(
    protected geRx: GeRx,
    protected store: IssuesManagementListApprovingState,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getIssuesManagementListToApprove(
    approveStateId: string,
    filterData?: IssuesManagementFilterInterface
  ): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.geRx.show(this.store.entityName, {
      filterData: {
        ...filterData,
        useSkip: false,
        count: 0,
        state: approveStateId,
      },
      currentEmployeeId,
    });
  }
}
