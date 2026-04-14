import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { IssuesInterface } from '../../issues/models/issues.interface';

@Injectable({
  providedIn: 'root',
})
export class BusinessTripsIssueService {
  constructor(private http: HttpClient) {}

  getIssueFields(issueId: string): Observable<IssuesInterface> {
    return this.http.get<IssuesInterface>(
      `${Environment.inv().api}/wa_issues/${issueId}`
    );
  }

  getDocumentFields(data: {
    typeId: string;
    issueId: string;
    documentId: string;
  }): Observable<{
    fields: {
      [key: string]: string | number;
    };
  }> {
    return this.http.get<{
      fields: {
        [key: string]: string | number;
      };
    }>(`${Environment.inv().api}/timesheet/documentFields`, {
      params: {
        typeId: data.typeId,
        issueId: data.issueId,
        documentId: data.documentId,
      },
    });
  }
}
