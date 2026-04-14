import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';
import { MainEmployeeAlertsFacade } from '../../../../features/main/facades/main-employee-alerts.facade';
import { ActionsService } from '../services/actions.service';

@Injectable({
  providedIn: 'root',
})
export class ActionsState {
  public entityName = 'unfinishedActions';

  public geRxMethods: GeRxMethods = {
    edit: {
      main: this.apiService.sendConfirmCode.bind(this.apiService),
      success: this.updateActions,
    },
  };

  constructor(
    private apiService: ActionsService,
    private alertsFacade: MainEmployeeAlertsFacade
  ) {}

  updateActions(): Observable<unknown> {
    this.alertsFacade.getAlerts();
    return of();
  }
}
