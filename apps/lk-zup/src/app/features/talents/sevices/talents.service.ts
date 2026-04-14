import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { LocalStorageService } from '@shared/services/local-storage.service';
import {
  TalentGridInterface,
  TalentItemInterface,
  TalentsListInterface,
} from '@features/talents/models/talents.interface';
import { FilterParamsInterface } from '@shared/models/filter-params.interface';
import { IssuesTypesTemplateInterface } from '@features/issues/models/issues-types.interface';
import { IssuesInterface } from '@features/issues/models/issues.interface';
import { FileBase64 } from '@shared/models/files.interface';
import { OptionListSurveyInterface } from '@features/surveys-management/models/surveys-management.interface';

@Injectable({
  providedIn: 'root',
})
export class TalentsService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
  ) {}

  getTalentsList(
    param: FilterParamsInterface,
  ): Observable<TalentsListInterface> {
    const employeeID: string = this.localStorageService.getCurrentEmployeeId();
    return this.http.get<TalentsListInterface>(
      `${Environment.inv().api}/talent/${employeeID}/subordinates`,
      {
        params: {
          ...param,
        },
      },
    );
  }

  getTalentsItemById(id: string): Observable<TalentItemInterface> {
    return this.http.get<TalentItemInterface>(
      `${Environment.inv().api}/talent/${id}/info`,
    );
  }

  getGrid(): Observable<TalentGridInterface> {
    return this.http.get<TalentGridInterface>(
      `${Environment.inv().api}/talent/talentDiagram`,
    );
  }

  getIssuesTypeAlias(alias: string): Observable<IssuesTypesTemplateInterface> {
    return this.http.get<IssuesTypesTemplateInterface>(
      `${Environment.inv().api}/wa_issueTypes/byAlias/${alias}`,
    );
  }

  createIssueRemoveTalent(body: any): Observable<IssuesInterface> {
    return this.http.post<IssuesInterface>(
      `${Environment.inv().api}/wa_issues`,
      body,
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
      }/wa_employee/${currentEmployeeId}/customReport/employeeTalents`,
      params,
    );
  }

  getOptions(alias: string, params?: any): Observable<OptionListSurveyInterface> {
    let httpParams = new HttpParams();
    if (params) {
      for (const key of Object.keys(params)) {
        if (params[key]) {
          httpParams = httpParams.append(key, params[key]);
        }
      }
    }
    return this.http.get<OptionListSurveyInterface>(
      `${Environment.inv().api}/wa_issueTypes/optionList/${alias}`,{
        params: httpParams,
      }
    );
  }
}
