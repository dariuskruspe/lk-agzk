import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { SuccessorItemInterface, SuccessorsListInterface } from '@features/successors/models/successors.interface';
import { FileBase64 } from '@shared/models/files.interface';
import { OptionListSurveyInterface } from '@features/surveys-management/models/surveys-management.interface';
import {
  SuccessorsFilterParamsInterface
} from "@features/successors/containers/successors-container/successors-container.component";

@Injectable({
  providedIn: 'root',
})
export class SuccessorsService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
  ) {}

  getSuccessorsList(
    param: SuccessorsFilterParamsInterface,
  ): Observable<SuccessorsListInterface> {
    const employeeID: string = this.localStorageService.getCurrentEmployeeId();
    return this.http.get<SuccessorsListInterface>(
      `${Environment.inv().api}/successors/${employeeID}/employee`,
      {
        params: {
          ...param,
        },
      },
    );
  }

  getSuccessorsItemById(id: string): Observable<SuccessorItemInterface> {
    return this.http.get<SuccessorItemInterface>(
      `${Environment.inv().api}/successors/${id}/info`,
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
      }/wa_employee/${currentEmployeeId}/customReport/successors`,
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
      `${Environment.inv().api}/wa_issueTypes/optionList/${alias}`,
      {
        params: httpParams
      }
    );
  }
}
