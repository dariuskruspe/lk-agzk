import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import {
  OptionListSurveyInterface,
  SurveyFilterParamsInterface,
  SurveyHistoryItemInterface,
  SurveyRequestInterface,
  SurveyResultRequestInterface,
  SurveysListInterface,
} from '../models/surveys-management.interface';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { FileBase64 } from '@shared/models/files.interface';

@Injectable({
  providedIn: 'root',
})
export class SurveysManagementService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
  ) {}

  getSurveys(
    role: 'manager' | 'employee' | 'coordinator',
    params: SurveyFilterParamsInterface,
    section?: 'general' | 'mySurveys' | 'archive',
  ): Observable<SurveysListInterface> {
    const employeeID = this.localStorageService.getCurrentEmployeeId();
    let httpParams = new HttpParams();
    if (params) {
      params.page =  params.page || 1;
      params.count = params.count || 15;
      params.useSkip = params.useSkip || false;
      for (const paramName of Object.keys(params)) {
        if (params[paramName] !== null) {
          httpParams = httpParams.append(paramName, params[paramName]);
        }
      }
      httpParams = httpParams.append('role', role);
    }
    if (section) {
      httpParams = httpParams.append('section', section);
    }
    return this.http.get<SurveysListInterface>(
      `${Environment.inv().api}/wa_employee/${employeeID}/surveys`,
      {
        params: httpParams,
      },
    );
  }

  getSurvey(
    id: string,
    role: 'manager' | 'employee' | 'coordinator',
  ): Observable<{ survey: SurveyRequestInterface }> {
    return this.http.get<{ survey: SurveyRequestInterface }>(
      `${Environment.inv().api}/surveys/${id}`,
      {
        params: {
          role,
        },
      },
    );
  }

  getSurveyHistory(
    id: string,
  ): Observable<{ states: SurveyHistoryItemInterface[] }> {
    return this.http.get<{ states: SurveyHistoryItemInterface[] }>(
      `${Environment.inv().api}/surveys/${id}/stateHistory`,
    );
  }

  getSurveyStates(): Observable<{
    states: { stateID: string; name: string; color: string; alias: string }[];
  }> {
    return this.http.get<{
      states: { stateID: string; name: string; color: string; alias: string }[];
    }>(`${Environment.inv().api}/surveys/states`);
  }

  createSurvey(
    survey: SurveyRequestInterface,
  ): Observable<{ survey: SurveyRequestInterface }> {
    return this.http.post<{ survey: SurveyRequestInterface }>(
      `${Environment.inv().api}/surveys`,
      survey,
    );
  }

  updateSurvey(
    survey: SurveyRequestInterface,
    surveyId: string,
  ): Observable<{ survey: SurveyRequestInterface }> {
    return this.http.patch<{ survey: SurveyRequestInterface }>(
      `${Environment.inv().api}/surveys/${surveyId}`,
      survey,
    );
  }

  getOptions(alias: string): Observable<OptionListSurveyInterface> {
    return this.http.get<OptionListSurveyInterface>(
      `${Environment.inv().api}/wa_issueTypes/optionList/${alias}`,
    );
  }

  approveSurvey(
    approve: boolean,
    comment: string,
    surveyId: string,
  ): Observable<{ survey: SurveyRequestInterface }> {
    return this.http.patch<{ survey: SurveyRequestInterface }>(
      `${Environment.inv().api}/surveys/${surveyId}/approve`,
      {
        approved: approve,
        comment,
      },
    );
  }

  sendSurvey(
    surveyId: string,
    survey: SurveyResultRequestInterface,
  ): Observable<any> {
    return this.http.patch<any>(
      `${Environment.inv().api}/surveys/${surveyId}/completing`,
      survey,
    );
  }

  getDownloadReport(
    reportType: 'surveyStatistics' | 'surveyResults',
    format: 'pdf' | 'xlsx',
    surveyID: string,
  ): Observable<FileBase64> {
    const currentEmployeeId: string =
      this.localStorageService.getCurrentEmployeeId();

    if (!currentEmployeeId) {
      throw new Error(`Failed to get current employee id from localStorage!`);
    }
    const params = {
      dateBegin: new Date().toISOString(),
      format,
      surveyID,
    };

    return this.http.post<FileBase64>(
      `${
        Environment.inv().api
      }/wa_employee/${currentEmployeeId}/customReport/${reportType}`,
      params,
    );
  }

  deleteSurvey(id: string) {
    return this.http.delete(`${Environment.inv().api}/surveys/${id}`);
  }

  getDownloadFile(fileLink: string): Observable<FileBase64> {
    return this.http.get<FileBase64>(
      `${Environment.inv().api}${fileLink}/base64`,
    );
  }
}
