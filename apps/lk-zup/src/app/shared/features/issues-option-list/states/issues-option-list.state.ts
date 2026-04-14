import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { forkJoin, Observable } from 'rxjs';
import { OptionListService } from '../../option-list/services/option-list.service';

@Injectable({
  providedIn: 'root',
})
export class IssueOptionListState {
  public entityName = 'issuesOptionList';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.showIssuesOptionLists,
    },
  };

  constructor(private optionListService: OptionListService) {}

  showIssuesOptionLists(aliases: string[]): Observable<never> {
    const joinObj = {};
    for (const alias of aliases) {
      joinObj[alias] = this.optionListService.showOptionList({alias});
    }
    return forkJoin(joinObj);
  }
}
