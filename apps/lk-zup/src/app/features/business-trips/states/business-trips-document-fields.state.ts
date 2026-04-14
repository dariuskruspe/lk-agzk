import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { BusinessTripsIssueService } from '../services/business-trips-issue.service';

@Injectable({
  providedIn: 'root',
})
export class BusinessTripsDocumentFieldsState {
  public entityName = 'businessTripsDocumentFields';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.businessTripsIssueService.getDocumentFields.bind(
        this.businessTripsIssueService
      ),
    },
  };

  constructor(private businessTripsIssueService: BusinessTripsIssueService) {}
}
