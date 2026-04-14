import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import {
  IssueApproveInterfaceError,
  IssueApproveInterfaceSuccess,
} from '../models/issue-approve.interface';
import { IssuesEmailApprovalInterface } from '../models/issues-email-approval.interface';

@Injectable({
  providedIn: 'root',
})
export class IssuesEmailApprovalService {
  constructor(private http: HttpClient) {}

  issueEmailApprove(
    passData: IssuesEmailApprovalInterface
  ): Observable<IssueApproveInterfaceSuccess | IssueApproveInterfaceError> {
    return this.http.patch<
      IssueApproveInterfaceSuccess | IssueApproveInterfaceError
    >(
      `${Environment.inv().apiRoot}/${
        passData.lang
      }/wa_issues/issueEmailApprove`,
      passData
    );
  }
}
