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
export class IssuesManagementListDashboardState {
  public entityName = 'issuesManagementListDashboard';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getIssuesManagementList,
    },
  };

  constructor(private issuesManagementService: IssuesManagementService) {}

  getIssuesManagementList(filterData?: {
    currentEmployeeId: string;
    filterData: IssuesManagementFilterInterface;
  }): Observable<IssuesManagementInterfaces> {
    return this.issuesManagementService.issuesEmployees(filterData);
  }
}
