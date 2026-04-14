import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import {
  IssuesTypesInterface,
  IssuesTypesTemplateInterface,
} from '../../issues/models/issues-types.interface';
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class BusinessTripsIssuesTypeService {
  constructor(private http: HttpClient) {}

  getIssuesTypeList(filterParam?: {
    groupAlias: string;
  }): Observable<IssuesTypesInterface[]> {
    let httpParams = new HttpParams();
    if (filterParam) {
      for (const paramName of Object.keys(filterParam)) {
        httpParams = httpParams.append(paramName, filterParam[paramName]);
      }
    }
    return this.http.get<IssuesTypesInterface[]>(
      `${Environment.inv().api}/wa_issueTypes`,
      {
        params: httpParams,
      }
    ).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getIssuesType(issueTypeID: string): Observable<IssuesTypesTemplateInterface> {
    return this.http.get<IssuesTypesTemplateInterface>(
      `${Environment.inv().api}/wa_issueTypes/${issueTypeID}`
    );
  }

  getIssuesTypeAlias(alias: string): Observable<IssuesTypesTemplateInterface> {
    return this.http.get<IssuesTypesTemplateInterface>(
      `${Environment.inv().api}/wa_issueTypes/byAlias/${alias}`
    );
  }
}
