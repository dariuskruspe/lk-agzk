import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { IssuesPageState } from '../states/issues-page.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesPageFacade extends AbstractFacade<unknown> {
  constructor(protected geRx: GeRx, protected store: IssuesPageState) {
    super(geRx, store);
  }

  showIssue(id: string): void {
    this.geRx.show(this.store.entityName, id);
  }

  showIssueType(id: string): void {
    this.geRx.exception(this.store.entityName, id);
  }
}
