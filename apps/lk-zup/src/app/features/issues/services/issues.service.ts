import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { IssuesHistoryInterface } from '../models/issues-history.interface';
import {
  IssueCancelInterface,
  IssuesInterface,
  IssuesStatusInterface,
} from '../models/issues.interface';
import { IssueStateListResource } from '@app/shared/api-resources/issue-state-list.resource';
import { injectResource } from '@app/shared/services/api-resource/utils';

@Injectable({
  providedIn: 'root',
})
export class IssuesService {
  loading: WritableSignal<boolean> = signal(false);

  issueStateList = injectResource(IssueStateListResource);

  constructor(private http: HttpClient) {}

  addIssue(body: IssuesInterface): Observable<IssuesInterface> {
    return this.http.post<IssuesInterface>(
      `${Environment.inv().api}/wa_issues`,
      body,
    );
  }

  showIssue(issuesId: string): Observable<IssuesInterface> {
    return this.http.get<IssuesInterface>(
      `${Environment.inv().api}/wa_issues/${issuesId}`,
    );
  }

  showHistory(issuesId: string): Observable<IssuesHistoryInterface> {
    return this.http.get<IssuesHistoryInterface>(
      `${Environment.inv().api}/wa_issues/${issuesId}/issueStateHistory`,
    );
  }

  editIssue(body: IssuesInterface): Observable<IssuesInterface> {
    return this.http.patch<IssuesInterface>(
      `${Environment.inv().api}/wa_issues/${body.IssueID}`,
      body,
    );
  }

  issuesStateList() {
    return this.issueStateList.asObservable();
  }

  issuesCancel(body: IssueCancelInterface): Observable<unknown> {
    return this.http.patch<IssuesHistoryInterface>(
      `${Environment.inv().api}/wa_issues/issueCancel`,
      body,
    );
  }

  issuesStatusSteps(
    issueId: string,
  ): Observable<{ stateIds: string[]; currentStateId: string }> {
    return this.http.get<{ stateIds: string[]; currentStateId: string }>(
      `${Environment.inv().api}/wa_issues/${issueId}/states`,
    );
  }

  /**
   * Проверяем, согласована ли задача по заявке.
   * @param taskId
   * @param body
   */
  isTaskApproved(taskId: string): Observable<{ taskApproved: boolean }> {
    return this.http.get<{ taskApproved: boolean }>(
      `${Environment.inv().api}/wa_issues/isTaskApproved/${taskId}`,
    );
  }
}
