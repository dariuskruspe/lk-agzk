import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { IssuesHistoryInterface } from '../models/issues-history.interface';
import { IssuesHistoryState } from '../states/issues-history.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesHistoryFacade extends AbstractFacade<IssuesHistoryInterface> {
  constructor(protected geRx: GeRx, protected store: IssuesHistoryState) {
    super(geRx, store);
  }

  showHistory(issueID: string): void {
    this.geRx.show(this.store.entityName, issueID);
  }
}
