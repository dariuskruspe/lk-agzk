import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { IssuesDocSignInterface } from '../models/issues-doc-sign.interface';
import { IssuesDocSignListState } from '../states/issues-doc-sign-list.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesDocsSignListFacade extends AbstractFacade<
  IssuesDocSignInterface[]
> {
  constructor(protected geRx: GeRx, protected store: IssuesDocSignListState) {
    super(geRx, store);
  }

  getDocSignList(issueID: string): void {
    this.geRx.show(this.store.entityName, issueID);
  }
}
