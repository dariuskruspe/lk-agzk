import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from '@shared/classes/ennvironment/environment';
import { Observable } from 'rxjs';
import {
  IssueApproveInterface,
  IssueApproveInterfaceError,
  IssueApproveInterfaceSuccess,
} from '../models/issue-approve.interface';

@Injectable({
  providedIn: 'root',
})
export class IssueApproveService {
  constructor(private http: HttpClient) {}

  /**
   * Согласовываем/отклоняем заявку.
   * @param data данные согласования/отклонения заявки (см. интерфейс IssueApproveInterface)
   */
  approveApplication(
    data: IssueApproveInterface
  ): Observable<IssueApproveInterfaceSuccess | IssueApproveInterfaceError> {
    return this.http.patch<
      IssueApproveInterfaceSuccess | IssueApproveInterfaceError
    >(`${Environment.inv().api}/wa_issues/issueApprove`, data);
  }
}
