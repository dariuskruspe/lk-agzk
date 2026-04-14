import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { QueryBuilder } from '../../../shared/classes/query-builder/query-builder';
import {
  IssuesManagementApproveResponse,
  IssuesManagementFilterInterface,
  IssuesManagementInterfaces,
} from '../models/issues-management-list.interfaces';

@Injectable({
  providedIn: 'root',
})
export class IssuesManagementService {
  constructor(private http: HttpClient) {}

  issuesEmployees(reqData?: {
    currentEmployeeId: string;
    filterData: IssuesManagementFilterInterface;
  }): Observable<IssuesManagementInterfaces> {
    return this.http.get<IssuesManagementInterfaces>(
      `${Environment.inv().api}/wa_employee/${
        reqData.currentEmployeeId
      }/issuesManagement`,
      {
        params: QueryBuilder.queryBuilder(reqData?.filterData),
      }
    );
  }

  approveIssuesList(data: {
    tasks: { taskId: string; approve: boolean }[];
    comment: string;
  }): Observable<IssuesManagementApproveResponse[]> {
    return this.http.patch<IssuesManagementApproveResponse[]>(
      `${Environment.inv().api}/wa_issues/issueApprove`,
      data
    );
  }
}
