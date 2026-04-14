import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import {
  IssueApproveInterfaceError,
  IssueApproveInterfaceSuccess,
} from '../models/issue-approve.interface';
import { IssuesEmailApprovalInterfaceOld } from '../models/issues-email-approval.interface';
import { IssuesEmailApprovalOldService } from '../services/issues-email-approval-old.service';

@Injectable({
  providedIn: 'root',
})
export class IssuesEmailApprovalOldState {
  public entityName = 'getApprovalOld';

  public geRxMethods: GeRxMethods = {
    edit: {
      main: this.approve,
    },
  };

  constructor(
    private issuesEmailApprovalService: IssuesEmailApprovalOldService
  ) {}

  approve(
    data: IssuesEmailApprovalInterfaceOld
  ): Observable<IssueApproveInterfaceSuccess | IssueApproveInterfaceError> {
    return this.issuesEmailApprovalService.approve(data);
  }
}
