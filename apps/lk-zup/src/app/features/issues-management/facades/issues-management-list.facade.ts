import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import {
  IssuesManagementFilterInterface,
  IssuesManagementInterfaces,
} from '../models/issues-management-list.interfaces';
import { IssuesManagementListState } from '../states/issues-manegement-list.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesManagementListFacade extends AbstractFacade<IssuesManagementInterfaces> {
  constructor(
    protected geRx: GeRx,
    protected store: IssuesManagementListState,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getIssuesManagementList(filterData?: IssuesManagementFilterInterface): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.geRx.show(this.store.entityName, { filterData, currentEmployeeId });
  }
}
