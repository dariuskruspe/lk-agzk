import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GeRx } from 'gerx';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  IssueApproveInterfaceError,
  IssueApproveInterfaceSuccess,
} from '../models/issue-approve.interface';
import { IssuesEmailApprovalInterface } from '../models/issues-email-approval.interface';
import { IssuesEmailApprovalService } from '../services/issues-email-approval.service';

@Injectable({
  providedIn: 'root',
})
export class IssuesEmailApprovalState {
  public entityName = 'getApproval';

  public geRxMethods: GeRxMethods = {
    edit: {
      main: this.issueApprove,
      success: () => of(),
    },
    show: {
      main: this.rememberIssue,
      success: this.redirectToIssue,
    },
    delete: {
      main: this.deleteIssue,
    },
  };

  private issue;

  constructor(
    private issuesEmailApprovalService: IssuesEmailApprovalService,
    private router: Router,
    private geRx: GeRx
  ) {}

  issueApprove(
    data: IssuesEmailApprovalInterface
  ): Observable<IssueApproveInterfaceSuccess | IssueApproveInterfaceError> {
    return this.issuesEmailApprovalService.issueEmailApprove(data).pipe(
      catchError((error: any) => {
        if (error.error?.toast) {
          const result: IssueApproveInterfaceSuccess = {
            state: error.error.toast?.type === 'warn' ? 3 : 2,
            message: {
              header: error.error.toast?.message.header,
              text: error.error.toast?.message.text,
            },
          };
          return of(result);
        }
        return error;
      })
    );
  }

  rememberIssue(
    data: IssuesEmailApprovalInterface | null
  ): Observable<IssuesEmailApprovalInterface | null> {
    if (data) this.issue = data;
    return of(data);
  }

  deleteIssue(): Observable<void> {
    this.geRx.show(this.entityName, null);
    return of();
  }

  redirectToIssue(): Observable<unknown> {
    if (this.geRx.getData(this.entityName)) {
      this.router.navigate(['auth']);
    } else {
      if (this.issue && this.issue.taskType) {
        this.router.navigate(['issueEmailApprove'], {
          queryParams: this.issue,
        });
      }
    }
    return of();
  }
}
