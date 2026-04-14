import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { IssuesManagementApproveResponse } from '../models/issues-management-list.interfaces';
import { IssuesManagementService } from '../services/issues-management.service';

@Injectable({
  providedIn: 'root',
})
export class IssuesApprovingListState {
  public entityName = 'issuesApprovingList';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.approveIssuesManagementList,
    },
  };

  constructor(private issuesManagementService: IssuesManagementService) {}

  approveIssuesManagementList(data: {
    tasks: { taskId: string; approve: boolean }[];
    comment: string;
  }): Observable<IssuesManagementApproveResponse[]> {
    return this.issuesManagementService.approveIssuesList(data);
  }
}
