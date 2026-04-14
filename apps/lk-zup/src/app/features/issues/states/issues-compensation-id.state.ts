import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { IssuesCompensationService } from '../services/issues-compensation.service';

@Injectable({
  providedIn: 'root',
})
export class IssuesCompensationIdState {
  public entityName = 'issuesCompensationID';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.issuesCompensationService.vacationBalanceByTypesID.bind(
        this.issuesCompensationService
      ),
    },
  };

  constructor(private issuesCompensationService: IssuesCompensationService) {}
}
