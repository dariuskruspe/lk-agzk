import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { IssuesInterface } from '../../issues/models/issues.interface';
import { BusinessTripsIssuesFieldsState } from '../states/business-trips-issues-fields.state';

@Injectable({
  providedIn: 'root',
})
export class BusinessTripsIssuesFieldsFacade extends AbstractFacade<IssuesInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: BusinessTripsIssuesFieldsState
  ) {
    super(geRx, store);
  }

  getIssueFields(issueId: string): void {
    this.geRx.show(this.store.entityName, issueId);
  }
}
