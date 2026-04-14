import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { IssuesTypeService } from '../services/issues-type.service';

@Injectable({
  providedIn: 'root',
})
export class IssuesTypeState {
  public entityName = 'issueType';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.issuesTypeService.getIssuesType.bind(this.issuesTypeService),
    },
    exception: {
      main: this.issuesTypeService.getIssuesTypeAlias.bind(
        this.issuesTypeService
      ),
    },
  };

  constructor(private issuesTypeService: IssuesTypeService) {}
}
