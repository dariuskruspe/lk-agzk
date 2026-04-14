import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { IssueApproveInterfaceSuccess } from '../models/issue-approve.interface';
import { IssuesEmailApprovalInterfaceOld } from '../models/issues-email-approval.interface';
import { IssuesEmailApprovalOldState } from '../states/issues-email-approval-old.state';

@Injectable({
  providedIn: 'root',
})
export class IssueEmailApprovalOldFacade extends AbstractFacade<IssueApproveInterfaceSuccess> {
  constructor(
    protected geRx: GeRx,
    protected store: IssuesEmailApprovalOldState
  ) {
    super(geRx, store);
  }

  approve(data: IssuesEmailApprovalInterfaceOld): void {
    this.geRx.edit(this.store.entityName, data);
  }
}
