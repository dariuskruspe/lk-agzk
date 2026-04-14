import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import {
  IssuesListFormFilter,
  IssuesListInterface,
} from '../models/issues.interface';
import { IssuesListState } from '../states/issues-list.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesListFacade extends AbstractFacade<IssuesListInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: IssuesListState,
    protected localStorage: LocalStorageService
  ) {
    super(geRx, store);
  }

  getList(filterData?: IssuesListFormFilter): void {
    const currentEmployeeId = this.localStorage.getCurrentEmployeeId();
    this.geRx.show(this.store.entityName, { filterData, currentEmployeeId });
  }
}
