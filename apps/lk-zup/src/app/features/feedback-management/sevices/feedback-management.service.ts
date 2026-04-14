import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { FilterParamsInterface } from '@shared/models/filter-params.interface';
import { FeedbackInterface } from '@features/feedback/models/feedback.interface';
import { SurveyRequestInterface } from '@features/surveys-management/models/surveys-management.interface';
import { FileBase64 } from '@shared/models/files.interface';

@Injectable({
  providedIn: 'root',
})
export class FeedbackManagementService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
  ) {}

  getFeedbackStates(): Observable<{
    states: { stateID: string; name: string; color: string; alias: string }[];
  }> {
    return this.http.get<{
      states: { stateID: string; name: string; color: string; alias: string }[];
    }>(`${Environment.inv().api}/surveys/states`);
  }

  getFeedbackRequests(
    params: FilterParamsInterface,
    section: 'general' | 'attention',
  ): Observable<{ feedback: FeedbackInterface[]; count: number }> {
    const employeeID = this.localStorageService.getCurrentEmployeeId();
    return this.http.get<{ feedback: FeedbackInterface[]; count: number }>(
      `${Environment.inv().api}/wa_employee/${employeeID}/feedback`,
      {
        params: {
          role: 'manager',
          section,
          ...params,
        },
      },
    );
  }

  getFeedbackItemById(
    id: string,
    data: { questionnaireID: string; senderID: string },
  ): Observable<{ feedback: FeedbackInterface }> {
    let httpParams = new HttpParams();
    if (data?.questionnaireID) {
      httpParams = httpParams.append('questionnaireID', data.questionnaireID);
    }
    if (data?.senderID) {
      httpParams = httpParams.append('senderID', data.senderID);
    }
    return this.http.get<{ feedback: FeedbackInterface }>(
      `${Environment.inv().api}/feedback/${id}`,
      { params: httpParams },
    );
  }

  patchFeedback(
    answers: {
      questionID: string;
      answer: string;
      noAnswer: boolean;
    }[],
    feedbackId: string,
  ): Observable<{ survey: SurveyRequestInterface }> {
    return this.http.patch<{ survey: SurveyRequestInterface }>(
      `${Environment.inv().api}/feedback/${feedbackId}`,
      {
        answers,
      },
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
      role: 'manager',
    };

    return this.http.post<FileBase64>(
      `${
        Environment.inv().api
      }/wa_employee/${currentEmployeeId}/customReport/feedbackAnalysis`,
      params,
    );
  }
}
