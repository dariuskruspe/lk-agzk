import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { IssuesTypesInterface } from '../../issues/models/issues-types.interface';
import { BusinessTripsIssuesTypeListState } from '../states/business-trips-issues-type-list.state';

@Injectable({
  providedIn: 'root',
})
export class BusinessTripsIssuesTypeListFacade extends AbstractFacade<IssuesTypesInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: BusinessTripsIssuesTypeListState
  ) {
    super(geRx, store);
  }

  getList(filterParam?: Params): void {
    this.geRx.show(this.store.entityName, filterParam);
  }
}
