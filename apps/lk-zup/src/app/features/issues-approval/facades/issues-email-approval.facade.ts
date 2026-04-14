import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { IssueApproveInterfaceSuccess } from '../models/issue-approve.interface';
import { IssuesEmailApprovalInterface } from '../models/issues-email-approval.interface';
import { IssuesEmailApprovalState } from '../states/issues-email-approval.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesEmailApprovalFacade extends AbstractFacade<
  IssuesEmailApprovalInterface | IssueApproveInterfaceSuccess
> {
  constructor(protected geRx: GeRx, protected store: IssuesEmailApprovalState) {
    super(geRx, store);
  }
}
