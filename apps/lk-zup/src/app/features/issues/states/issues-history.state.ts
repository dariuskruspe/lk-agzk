import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IssuesHistoryInterface } from '../models/issues-history.interface';
import { IssuesService } from '../services/issues.service';

@Injectable({
  providedIn: 'root',
})
export class IssuesHistoryState {
  public entityName = 'issueHistory';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getHistory,
    },
  };

  constructor(private issuesService: IssuesService) {}

  getHistory(id: string): Observable<IssuesHistoryInterface> {
    return this.issuesService.showHistory(id).pipe(
      map((data) => {
        return {
          states: data.states.map((state) => ({
            ...state,
            color: state.color.startsWith('#')
              ? state.color
              : `var(--${state.color})`,
          })),
        };
      })
    );
  }
}
