import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { IssuesStatusItemInterface } from '../models/issues-status-item.interface';
import { IssuesStatusStepsState } from '../states/issues-status-steps.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesStatusStepsFacade extends AbstractFacade<
  IssuesStatusItemInterface[]
> {
  constructor(protected geRx: GeRx, protected store: IssuesStatusStepsState) {
    super(geRx, store);
  }

  getList(issueId: string): void {
    this.geRx.show(this.store.entityName, issueId);
  }

  setStateOrder(index: number) {
    this.store.stateOrder = index;
  }
}
