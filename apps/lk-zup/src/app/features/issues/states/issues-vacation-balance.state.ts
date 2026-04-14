import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { IssuesCompensationService } from '../services/issues-compensation.service';

@Injectable({
  providedIn: 'root',
})
export class IssuesVacationBalanceState {
  public entityName = 'issuesVacationBalance';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.issuesCompensationService.vacationBalance.bind(
        this.issuesCompensationService
      ),
    },
  };

  constructor(private issuesCompensationService: IssuesCompensationService) {}
}
