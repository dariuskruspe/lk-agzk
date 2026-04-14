import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { SupportHelpMainInterface } from '../models/support-help.interface';
import { SupportHelpService } from '../services/support-help.service';

@Injectable({
  providedIn: 'root',
})
export class SupportInformationPageState {
  public entityName = 'supportInformationPage';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getSupportHelpBlock,
    },
  };

  constructor(private supportHelpService: SupportHelpService) {}

  getSupportHelpBlock(pageId: string): Observable<SupportHelpMainInterface> {
    return this.supportHelpService.getSupportHelpBlock(pageId);
  }
}
