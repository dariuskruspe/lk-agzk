import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { InsuranceIssueTypes } from '../models/insurance-issue-types.interface';
import { InsuranceIssueTypeState } from '../states/insurance-issues-type.state';

@Injectable({
  providedIn: 'root',
})
export class InsuranceIssuesTypeFacade extends AbstractFacade<InsuranceIssueTypes> {
  constructor(protected geRx: GeRx, protected store: InsuranceIssueTypeState) {
    super(geRx, store);
  }

  getInsuranceIssueTypes(): void {
    this.geRx.show(this.store.entityName);
  }
}
