import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { IssuesDocSignInterface } from '../models/issues-doc-sign.interface';
import { IssuesDocSignService } from '../services/issues-doc-sign.service';

@Injectable({
  providedIn: 'root',
})
export class IssuesDocSignListState {
  public entityName = 'issuesDocSignListState';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getDocSignList,
    },
  };

  constructor(private issuesDocSignService: IssuesDocSignService) {}

  getDocSignList(issueID: string): Observable<IssuesDocSignInterface[]> {
    return this.issuesDocSignService.getDocSignList(issueID);
  }
}
