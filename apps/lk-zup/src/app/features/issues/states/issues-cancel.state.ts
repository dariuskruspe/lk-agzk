import { Injectable } from '@angular/core';
import { IssuesStatusStepsState } from '@features/issues/states/issues-status-steps.state';
import { GeRx } from 'gerx';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';
import { IssueCancelInterface } from '../models/issues.interface';
import { IssuesService } from '../services/issues.service';
import { IssuesDocSignListState } from './issues-doc-sign-list.state';
import { IssuesHistoryState } from './issues-history.state';
import { IssuesState } from './issues.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesCancelState {
  public entityName = 'issueCancel';

  public geRxMethods: GeRxMethods = {
    edit: {
      main: this.issueCancel,
      success: this.issueCancelSuccess,
    },
  };

  constructor(
    private issuesService: IssuesService,
    private geRx: GeRx,
    private issuesState: IssuesState,
    private issuesHistoryState: IssuesHistoryState,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    private IssuesStatusStepsState: IssuesStatusStepsState,
    private issueDocumentsState: IssuesDocSignListState
  ) {}

  issueCancel(body: IssueCancelInterface): Observable<unknown> {
    return this.issuesService.issuesCancel(body);
  }

  issueCancelSuccess(req: any): Observable<any> {
    this.geRx.show(this.IssuesStatusStepsState.entityName, req?.issueID);
    this.geRx.show(this.issuesState.entityName, req?.issueID);
    this.geRx.show(this.issuesHistoryState.entityName, req?.issueID);
    this.geRx.show(this.issueDocumentsState.entityName, req?.issueID);
    return of();
  }
}
