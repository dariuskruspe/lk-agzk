import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';
import { MessageSnackbarService } from '../../../shared/features/message-snackbar/message-snackbar.service';
import { MessageType } from '../../../shared/features/message-snackbar/models/message-type.enum';
import { AlertsInterface } from '../models/alerts.interface';
import { MainEmployeeAlertsService } from '../services/main-employee-alerts.service';

@Injectable({
  providedIn: 'root',
})
export class MainEmployeeAlertsState {
  public entityName = 'employeeAlerts';

  public geRxMethods: GeRxMethods = {
    exception: {
      main: this.mainEmployeeAlertsService.getAlerts.bind(
        this.mainEmployeeAlertsService
      ),
      success: this.alertMessages,
    },
  };

  constructor(
    private mainEmployeeAlertsService: MainEmployeeAlertsService,
    private messageSnackbarService: MessageSnackbarService
  ) {}

  alertMessages(messages: AlertsInterface): Observable<unknown> {
    if (messages.general?.length) {
      messages.general?.forEach((message) => {
        this.messageSnackbarService.show(message, MessageType.warn);
      });
    }
    return of();
  }
}
