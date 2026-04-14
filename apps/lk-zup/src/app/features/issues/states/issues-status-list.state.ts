import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IssuesStatusInterface } from '../models/issues.interface';
import { IssuesService } from '../services/issues.service';

@Injectable({
  providedIn: 'root',
})
export class IssuesStatusListState {
  public entityName = 'issueStatus';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getIssuesStatusList,
    },
  };

  constructor(private issuesService: IssuesService) {}

  getIssuesStatusList() {
    return this.issuesService.issuesStateList();
  }
}
