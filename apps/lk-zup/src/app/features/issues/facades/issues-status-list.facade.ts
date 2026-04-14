import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { IssuesStatusInterface } from '../models/issues.interface';
import { IssuesStatusListState } from '../states/issues-status-list.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesStatusListFacade extends AbstractFacade<IssuesStatusInterface> {
  constructor(protected geRx: GeRx, protected store: IssuesStatusListState) {
    super(geRx, store);
  }

  getIssuesStatusList(): void {
    this.geRx.show(this.store.entityName);
  }
}
