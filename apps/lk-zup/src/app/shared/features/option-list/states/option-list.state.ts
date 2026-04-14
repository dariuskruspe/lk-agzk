import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { forkJoin, Observable } from 'rxjs';
import { OptionListService } from '../services/option-list.service';

@Injectable({
  providedIn: 'root',
})
export class OptionListState {
  public entityName = 'optionList';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.showOptionLists,
    },
  };

  constructor(private optionListService: OptionListService) {}

  showOptionLists(data: { aliases: string[], employeeId?: string }): Observable<never> {
    const joinObj = {};
    for (const alias of data.aliases) {
      joinObj[alias] = this.optionListService.showOptionList({ alias, employeeId: data.employeeId });
    }
    return forkJoin(joinObj);
  }
}
