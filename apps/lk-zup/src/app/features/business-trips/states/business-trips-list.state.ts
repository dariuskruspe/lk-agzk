import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { BusinessTripsIssuesListService } from '../services/business-trips-issues-list.service';

@Injectable({
  providedIn: 'root',
})
export class BusinessTripsListState {
  public entityName = 'businessTripIssueList';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.issuesListService.getIssues.bind(this.issuesListService),
    },
  };

  constructor(private issuesListService: BusinessTripsIssuesListService) {}
}
