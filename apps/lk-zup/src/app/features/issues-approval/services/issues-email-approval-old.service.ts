import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import {
  IssueApproveInterfaceError,
  IssueApproveInterfaceSuccess,
} from '../models/issue-approve.interface';
import { IssuesEmailApprovalInterfaceOld } from '../models/issues-email-approval.interface';

@Injectable({
  providedIn: 'root',
})
export class IssuesEmailApprovalOldService {
  constructor(private http: HttpClient) {}

  approve(
    passData: IssuesEmailApprovalInterfaceOld
  ): Observable<IssueApproveInterfaceSuccess | IssueApproveInterfaceError> {
    return this.http.patch<
      IssueApproveInterfaceSuccess | IssueApproveInterfaceError
    >(`${Environment.inv().api}/wa_issues/approve`, passData);
  }
}
