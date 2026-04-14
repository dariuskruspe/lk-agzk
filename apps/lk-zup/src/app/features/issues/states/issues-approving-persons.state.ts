import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { IssuesTypeService } from '../services/issues-type.service';

@Injectable({
  providedIn: 'root',
})
export class IssuesApprovingPersonsState {
  public entityName = 'issueApprovingPersons';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.issuesTypeService.getApprovingPersons.bind(
        this.issuesTypeService
      ),
    },
  };

  constructor(private issuesTypeService: IssuesTypeService) {}
}
