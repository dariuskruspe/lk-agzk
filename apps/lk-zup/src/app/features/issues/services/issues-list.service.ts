import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import {
  IssuesListFormFilter,
  IssuesListInterface,
} from '../models/issues.interface';

@Injectable({
  providedIn: 'root',
})
export class IssuesListService {
  constructor(private http: HttpClient) {}

  getIssues(reqData?: {
    currentEmployeeId: string;
    filterData: IssuesListFormFilter;
  }): Observable<IssuesListInterface> {
    return this.http.get<IssuesListInterface>(
      `${Environment.inv().api}/wa_employee/${
        reqData.currentEmployeeId
      }/issues`,
      {
        params: {
          ...reqData?.filterData,
          employeeType: 'applicant',
        },
      }
    );
  }

  getIssuesOtherEmployee(reqData?: {
    currentEmployeeId: string;
    filterData: IssuesListFormFilter;
  }): Observable<IssuesListInterface> {
    return this.http.get<IssuesListInterface>(
      `${Environment.inv().api}/wa_employee/${
        reqData.currentEmployeeId
      }/issues`,
      {
        params: {
          ...reqData?.filterData,
          employeeType: 'otherEmployee',
        },
      }
    );
  }
}
