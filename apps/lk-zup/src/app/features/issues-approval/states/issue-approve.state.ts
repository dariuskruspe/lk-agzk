import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';
import { IssuesDocsSignListFacade } from '../../issues/facades/issues-docs-sign-list.facade';
import { IssuesHistoryFacade } from '../../issues/facades/issues-history.facade';
import { IssuesFacade } from '../../issues/facades/issues.facade';
import {
  IssueApproveInterface,
  IssueApproveInterfaceError,
  IssueApproveInterfaceSuccess,
} from '../models/issue-approve.interface';
import { IssueApproveService } from '../services/issue-approve.service';

@Injectable({
  providedIn: 'root',
})
export class IssueApproveState {
  public entityName = 'issuesApprove';

  public geRxMethods: GeRxMethods = {
    edit: {
      main: this.setApproveStatus,
      success: this.getIssue,
    },
  };

  constructor(
    private issueApproveService: IssueApproveService,
    private issueFacade: IssuesFacade,
    private issueHistoryFacade: IssuesHistoryFacade,
    public issuesDocsSignListFacade: IssuesDocsSignListFacade
  ) {}

  setApproveStatus(
    data: IssueApproveInterface
  ): Observable<IssueApproveInterfaceSuccess | IssueApproveInterfaceError> {
    return this.issueApproveService.approveApplication(data);
  }

  getIssue(): Observable<unknown> {
    const currentIssue = this.issueFacade.getData();
    this.issueFacade.showIssue(currentIssue.issue.IssueID);
    this.issueHistoryFacade.showHistory(currentIssue.issue.IssueID);
    this.issuesDocsSignListFacade.getDocSignList(currentIssue.issue.IssueID);
    return of();
  }
}
