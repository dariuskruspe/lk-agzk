import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';
import { IssuesTypesTemplateInterface } from '../../issues/models/issues-types.interface';
import { IssuesInterface } from '../../issues/models/issues.interface';
import { IssuesTypeService } from '../../issues/services/issues-type.service';
import { IssuesService } from '../../issues/services/issues.service';

@Injectable({
  providedIn: 'root',
})
export class UsersProfileIssuesState {
  public entityName = 'userProfileIssues';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.showIssueAlias,
    },
    add: {
      main: this.addIssueDialog,
      success: this.addIssueDialogSuccess,
    },
  };

  public dialogImport;

  constructor(
    private issuesTypeService: IssuesTypeService,
    private issuesService: IssuesService
  ) {}

  showIssueAlias(alias: string): Observable<IssuesTypesTemplateInterface> {
    return this.issuesTypeService.getIssuesTypeAlias(alias);
  }

  addIssueDialog(body: IssuesInterface): Observable<IssuesInterface> {
    return this.issuesService.addIssue(body);
  }

  addIssueDialogSuccess(response: unknown): Observable<void> {
    return of(this.dialogImport.close(response));
  }
}
