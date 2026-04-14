import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { BusinessTripsIssueService } from '../services/business-trips-issue.service';

@Injectable({
  providedIn: 'root',
})
export class BusinessTripsIssuesFieldsState {
  public entityName = 'businessTripsIssuesFields';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.businessTripsIssueService.getIssueFields.bind(
        this.businessTripsIssueService
      ),
    },
  };

  constructor(private businessTripsIssueService: BusinessTripsIssueService) {}
}
