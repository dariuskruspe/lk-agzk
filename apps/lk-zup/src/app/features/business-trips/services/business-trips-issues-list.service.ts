import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import {
  IssuesListFormFilter,
  IssuesListInterface,
} from '../../issues/models/issues.interface';

@Injectable({
  providedIn: 'root',
})
export class BusinessTripsIssuesListService {
  constructor(private http: HttpClient) {}

  getIssues(reqData?: {
    currentEmployeeId: string;
    filterData: IssuesListFormFilter;
  }): Observable<IssuesListInterface> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('noSkip', 'true');
    httpParams = httpParams.append('searchTarget', 'issueType');
    if (reqData && reqData.filterData) {
      for (const key of Object.keys(reqData.filterData)) {
        if (
          Array.isArray(reqData.filterData[key])
            ? reqData.filterData[key].length
            : reqData.filterData[key]
        ) {
          httpParams = httpParams.append(key, reqData.filterData[key]);
        }
      }
    }
    return this.http.get<IssuesListInterface>(
      `${Environment.inv().api}/issues/businessTrips`,
      {
        params: httpParams,
      }
    );
  }
}
