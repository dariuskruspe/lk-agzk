import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { BusinessTripsIssuesTypeService } from '../services/business-trips-issues-type.service';

@Injectable({
  providedIn: 'root',
})
export class BusinessTripsIssuesTypeListState {
  public entityName = 'businessTripsIssuesTypeList';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.issuesTypeService.getIssuesTypeList.bind(
        this.issuesTypeService
      ),
    },
  };

  constructor(private issuesTypeService: BusinessTripsIssuesTypeService) {}
}
