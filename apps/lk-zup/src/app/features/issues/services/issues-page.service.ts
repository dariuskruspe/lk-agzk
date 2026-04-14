import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { IssuesInterface } from '../models/issues.interface';

@Injectable({
  providedIn: 'root',
})
export class IssuesPageService {
  constructor(private http: HttpClient) {}

  getIssueTypes(id: string): Observable<IssuesInterface> {
    return this.http.get<IssuesInterface>(
      `${Environment.inv().api}/issueTypes/${id}`
    );
  }

  getIssue(id: string): Observable<IssuesInterface> {
    return this.http.get<IssuesInterface>(
      `${Environment.inv().api}/issues/${id}`
    );
  }
}
