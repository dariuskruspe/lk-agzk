import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import {
  IssuesListFormFilter,
  IssuesListInterface,
} from '../../issues/models/issues.interface';
import { BusinessTripsListState } from '../states/business-trips-list.state';

@Injectable({
  providedIn: 'root',
})
export class BusinessTripsIssuesListFacade extends AbstractFacade<IssuesListInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: BusinessTripsListState,
    private localStorage: LocalStorageService
  ) {
    super(geRx, store);
  }

  getList(filterData?: IssuesListFormFilter): void {
    const currentEmployeeId = this.localStorage.getCurrentEmployeeId();
    this.geRx.show(this.store.entityName, { filterData, currentEmployeeId });
  }
}
