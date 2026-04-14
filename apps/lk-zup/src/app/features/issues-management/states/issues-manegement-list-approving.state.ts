import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import {
  IssuesManagementFilterInterface,
  IssuesManagementInterfaces,
} from '../models/issues-management-list.interfaces';
import { IssuesManagementService } from '../services/issues-management.service';

@Injectable({
  providedIn: 'root',
})
export class IssuesManagementListApprovingState {
  public entityName = 'issuesManagementListApproving';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getIssuesManagementListToApprove,
    },
  };

  constructor(private issuesManagementService: IssuesManagementService) {}

  getIssuesManagementListToApprove(filterData?: {
    currentEmployeeId: string;
    filterData: IssuesManagementFilterInterface;
  }): Observable<IssuesManagementInterfaces> {
    return this.issuesManagementService.issuesEmployees(filterData);
  }
}
