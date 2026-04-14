import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { IssuesListService } from '../services/issues-list.service';

@Injectable({
  providedIn: 'root',
})
export class IssuesOtherEmployeeListState {
  public entityName = 'issueOtherEmployeeList';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.issuesListService.getIssuesOtherEmployee.bind(
        this.issuesListService
      ),
    },
  };

  constructor(private issuesListService: IssuesListService) {}
}
