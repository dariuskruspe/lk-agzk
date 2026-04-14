import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { FilterParamsInterface } from '../../../shared/models/filter-params.interface';
import { InsuranceIssues } from '../models/insurance-issues.interface';
import { InsuranceIssueState } from '../states/insurance-issues.state';

@Injectable({
  providedIn: 'root',
})
export class InsuranceIssuesFacade extends AbstractFacade<InsuranceIssues> {
  constructor(protected geRx: GeRx, protected store: InsuranceIssueState) {
    super(geRx, store);
  }

  getInsuranceIssues(filter?: FilterParamsInterface): void {
    this.show(filter);
  }
}
