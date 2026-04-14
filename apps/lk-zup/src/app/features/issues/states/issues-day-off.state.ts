import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { IssuesDayOffService } from '../services/issues-day-off.service';

@Injectable({
  providedIn: 'root',
})
export class IssuesDayOffState {
  public entityName = 'issuesDayOff';

  public geRxMethods: GeRxMethods = {
    exception: {
      main: this.issuesDayOffService.getDayOff.bind(this.issuesDayOffService),
    },
  };

  constructor(private issuesDayOffService: IssuesDayOffService) {}
}
