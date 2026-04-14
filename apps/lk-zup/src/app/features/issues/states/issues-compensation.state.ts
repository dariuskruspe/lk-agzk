import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { IssuesCompensationService } from '../services/issues-compensation.service';

@Injectable({
  providedIn: 'root',
})
export class IssuesCompensationState {
  public entityName = 'issuesCompensation';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.issuesCompensationService.vacationBalanceByTypes.bind(
        this.issuesCompensationService
      ),
    },
  };

  constructor(private issuesCompensationService: IssuesCompensationService) {}
}
