import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { SupportHelpMenuInterface } from '../models/support-help.interface';
import { SupportHelpService } from '../services/support-help.service';

@Injectable({
  providedIn: 'root',
})
export class SupportHelpSideMenu {
  public entityName = 'supportHelpSideMenu';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getSupportHelpSideMenu,
    },
  };

  constructor(
    private supportHelpService: SupportHelpService,
    private router: Router
  ) {}

  getSupportHelpSideMenu(
    groupId: string
  ): Observable<SupportHelpMenuInterface[]> {
    return this.supportHelpService.getSupportHelpSideMenu(groupId);
  }
}
