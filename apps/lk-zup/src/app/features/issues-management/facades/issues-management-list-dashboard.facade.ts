import { Injectable } from '@angular/core';
import { IssuesManagementListDashboardState } from '@features/issues-management/states/issues-manegement-list-dashboard.state';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import {
  IssuesManagementFilterInterface,
  IssuesManagementInterfaces,
} from '../models/issues-management-list.interfaces';

@Injectable({
  providedIn: 'root',
})
export class IssuesManagementListDashboardFacade extends AbstractFacade<IssuesManagementInterfaces> {
  constructor(
    protected geRx: GeRx,
    protected store: IssuesManagementListDashboardState,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getIssuesManagementList(filterData?: IssuesManagementFilterInterface): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.geRx.show(this.store.entityName, { filterData, currentEmployeeId });
  }
}
