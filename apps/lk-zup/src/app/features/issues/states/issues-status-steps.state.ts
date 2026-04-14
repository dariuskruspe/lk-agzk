import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IssuesStatusListFacade } from '../facades/issues-status-list.facade';
import { IssuesStatusItemInterface } from '../models/issues-status-item.interface';
import { IssuesService } from '../services/issues.service';

@Injectable({
  providedIn: 'root',
})
export class IssuesStatusStepsState {
  public entityName = 'issueStatusSteps';

  public stateOrder;

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getIssuesStatusSteps,
    },
  };

  constructor(
    private issuesService: IssuesService,
    private issuesStatusListFacade: IssuesStatusListFacade
  ) {}

  getIssuesStatusSteps(
    issueId: string
  ): Observable<IssuesStatusItemInterface[]> {
    return this.issuesService.issuesStatusSteps(issueId).pipe(
      map((data) => {
        return data.stateIds.map((stateId: string, index) => {
          const stateFromList = this.issuesStatusListFacade
            .getData()
            .states.find((state) => state.id === stateId);
          return {
            icon: stateFromList.icon,
            active: this.stateOrder ? this.stateOrder === (index + 1) : stateId === data.currentStateId,
            title: stateFromList.name,
            description: stateFromList.description,
            id: stateId,
          };
        });
      })
    );
  }
}
