import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { IssuesCompensationService } from '../services/issues-compensation.service';

@Injectable({
  providedIn: 'root',
})
export class IssuesVacationBalanceDateState {
  public entityName = 'issuesVacationBalanceDate';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.issuesCompensationService.vacationBalanceByDate.bind(
        this.issuesCompensationService
      ),
    },
  };

  constructor(private issuesCompensationService: IssuesCompensationService) {}
}
