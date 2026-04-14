import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { IssuesInterface } from '../models/issues.interface';
import { IssuesPageService } from '../services/issues-page.service';

@Injectable({
  providedIn: 'root',
})
export class IssuesPageState {
  public entityName = 'issuePage';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.showIssue,
    },
    exception: {
      main: this.showIssueType,
    },
  };

  constructor(private issuesPageService: IssuesPageService) {}

  showIssue(id: string): Observable<IssuesInterface> {
    return this.issuesPageService
      .getIssue(id)
      .pipe(
        concatMap((res: any) =>
          this.issuesPageService.getIssueTypes(res.issueTypeId)
        )
      );
  }

  showIssueType(id: string): Observable<IssuesInterface> {
    return this.issuesPageService.getIssueTypes(id);
  }
}
