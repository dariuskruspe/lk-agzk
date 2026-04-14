import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IssuesTypesInterface,
  IssuesTypesTemplateInterface,
} from '@app/features/issues/models/issues-types.interface';
import { Environment } from '@app/shared/classes/ennvironment/environment';
import { Observable } from 'rxjs';
import { IssueTemplateValue } from './types';

@Injectable({
  providedIn: 'root',
})
export class IssueTemplateApiService {
  constructor(private http: HttpClient) {}

  getIssueTemplates(): Observable<IssuesTypesInterface> {
    return this.http.get<IssuesTypesInterface>(
      `${Environment.inv().api}/wa_issueTypes`,
    );
  }

  getIssueTemplateById(id: string): Observable<IssuesTypesTemplateInterface> {
    return this.http.get<IssuesTypesTemplateInterface>(
      `${Environment.inv().api}/wa_issueTypes/${id}`,
    );
  }

  updateIssueTemplate(id: string, data: IssueTemplateValue): Observable<void> {
    const { settings, template, ...rest } = data;
    return this.http.post<void>(`${Environment.inv().api}/manage/issueTypes`, {
      issueTypeID: id,
      ...rest,
      ...settings,
      originTemplate: template,
    });
  }
}
