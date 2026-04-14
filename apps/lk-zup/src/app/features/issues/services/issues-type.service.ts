import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import {
  IssuesTypesInterface,
  IssuesTypesTemplateInterface,
} from '../models/issues-types.interface';
import { catchError } from 'rxjs/operators';
import { injectResource } from '@app/shared/services/api-resource';
import { IssueTypesResource } from '@app/shared/api-resources/issue-types.resource';

@Injectable({
  providedIn: 'root',
})
export class IssuesTypeService {
  issuesTypeListResource = injectResource(IssueTypesResource);

  constructor(private http: HttpClient) {}

  getIssuesType(issueTypeID: string): Observable<IssuesTypesTemplateInterface> {
    return this.http.get<IssuesTypesTemplateInterface>(
      `${Environment.inv().api}/wa_issueTypes/${issueTypeID}`,
    );
  }

  getApprovingPersons(data: {
    employeeID: string;
    issueTypeID: string;
  }): Observable<string[]> {
    return this.http.get<string[]>(
      `${Environment.inv().api}/wa_issues/issueApprovingPersons`,
      {
        params: data,
      },
    );
  }

  getIssuesTypeAlias(alias: string): Observable<IssuesTypesTemplateInterface> {
    return this.http.get<IssuesTypesTemplateInterface>(
      `${Environment.inv().api}/wa_issueTypes/byAlias/${alias}`,
    );
  }
}
