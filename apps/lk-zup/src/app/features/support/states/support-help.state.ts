import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { SupportHelpItemInterface } from '../models/support-help.interface';
import { SupportHelpService } from '../services/support-help.service';

@Injectable({
  providedIn: 'root',
})
export class SupportHelpState {
  public entityName = 'supportHelp';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getSupportHelpList,
    },
  };

  constructor(private supportHelpService: SupportHelpService) {}

  getSupportHelpList(): Observable<SupportHelpItemInterface[]> {
    return this.supportHelpService.getSupportHelpList();
  }
}
