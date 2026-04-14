import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { IssuesCompensationService } from '../services/issues-compensation.service';

@Injectable({
  providedIn: 'root',
})
export class IssuesVacationBalanceEndDateState {
  public entityName = 'issuesVacationBalanceEndDate';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.issuesCompensationService.vacationBalanceByDate.bind(
        this.issuesCompensationService
      ),
    },
  };

  constructor(private issuesCompensationService: IssuesCompensationService) {}
}
