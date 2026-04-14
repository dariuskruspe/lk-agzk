import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { IssuesTypesInterface } from '../models/issues-types.interface';
import { IssuesTypeListState } from '../states/issues-type-list.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesTypeListFacade extends AbstractFacade<IssuesTypesInterface> {
  constructor(protected geRx: GeRx, protected store: IssuesTypeListState) {
    super(geRx, store);
  }

  getList(filterParam?: Params): void {
    this.geRx.show(this.store.entityName, filterParam);
  }
}
