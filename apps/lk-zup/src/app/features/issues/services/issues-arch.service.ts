import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { FileBase64 } from '../../../shared/models/files.interface';

@Injectable({
  providedIn: 'root',
})
export class IssuesArchService {
  constructor(private http: HttpClient) {}

  getIssueArch(issueId: string): Observable<FileBase64 | string> {
    return this.http.get<FileBase64 | string>(
      `${Environment.inv().api}/wa_issues/${issueId}/documentsArchive`
    );
  }
}
