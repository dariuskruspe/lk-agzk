import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Environment } from '@app/shared/classes/ennvironment/environment';
import {
  GetGoalsResult,
  GoalForm,
  GoalSubmitItem,
} from '@features/career/shared/types';
import { IssueTypes } from '@features/issues/models/issues-types.interface';
import { IssuesService } from '@features/issues/services/issues.service';
import { SharedStateService } from '@shared/states/shared-state.service';
import { UserStateService } from '@shared/states/user-state.service';
import { pick } from 'lodash';
import { Observable } from 'rxjs';
import { FileBase64 } from '@shared/models/files.interface';
import { LocalStorageService } from '@shared/services/local-storage.service';

const GOALS_SUBMIT_ISSUE_ALIAS = 'submitGoals';

@Injectable({
  providedIn: 'root',
})
export class GoalsApiService {
  private http = inject(HttpClient);

  private shared = inject(SharedStateService);

  private user = inject(UserStateService);

  private issuesService = inject(IssuesService);

  private localStorageService = inject(LocalStorageService);

  submitGoalsIssue: IssueTypes | undefined;

  constructor() {
    console.log('init submitGoalsIssue', this.shared.flatIssueTypes());
    console.log('init submitGoalsIssue', this.shared.flatIssueTypes().find((i) => i.issueTypeAlias === GOALS_SUBMIT_ISSUE_ALIAS));
    this.submitGoalsIssue = this.shared
      .flatIssueTypes()
      .find((i) => i.issueTypeAlias === GOALS_SUBMIT_ISSUE_ALIAS);
    console.log('this.submitGoalsIssue', this.submitGoalsIssue);
  }

  getGoals() {
    return this.http.get<GetGoalsResult>(`${Environment.inv().api}/goals`);
  }

  submit(goals: GoalForm[]) {
    return this.http.post(`${Environment.inv().api}/goals`, {
      draft: false,
      goals: this.convertGoalFormToGoalSubmitItem(goals),
    });
  }

  save(goals: GoalForm[]) {
    return this.http.post(`${Environment.inv().api}/goals`, {
      goals: this.convertGoalFormToGoalSubmitItem(goals),
      draft: true,
    });
  }

  createGoalIssue(goals: GoalForm[]) {
    console.log('submit this.submitGoalsIssue', this.submitGoalsIssue);
    return this.issuesService.addIssue({
      goals: this.convertGoalFormToGoalSubmitItem(goals),
      issueTypeID: this.submitGoalsIssue.issueTypeID,
      employeeID: this.user.activeEmployeeId(),
      userID: this.user.current().userID,
    } as any);
  }

  convertGoalFormToGoalSubmitItem(goals: GoalForm[]): GoalSubmitItem[] {
    return goals.map((i) =>
      pick(i, ['goalID', 'categoryID', 'name', 'description', 'isDeleted']),
    );
  }

  getDownloadReport(
    format: 'pdf' | 'xlsx',
  ): Observable<FileBase64> {
    const currentEmployeeId: string =
      this.localStorageService.getCurrentEmployeeId();

    if (!currentEmployeeId) {
      throw new Error(`Failed to get current employee id from localStorage!`);
    }
    const params = {
      dateBegin: new Date().toISOString(),
      format,
    };

    return this.http.post<FileBase64>(
      `${
        Environment.inv().api
      }/wa_employee/${currentEmployeeId}/customReport/employeeGoals`,
      params,
    );
  }
}
