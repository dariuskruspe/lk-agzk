import { Injectable } from '@angular/core';
import { MainNotificationsService } from '@features/main/services/main-notifications.service';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainNotificationsViewedState {
  public entityName = 'notificationsViewed';

  public geRxMethods: GeRxMethods = {
    exception: {
      main: this.setNotifications,
    },
  };

  constructor(private mainNotificationsService: MainNotificationsService) {}

  setNotifications(params: {
    currentEmployeeId: string;
    ids: string[];
  }): Observable<string[]> {
    return this.mainNotificationsService.setNotificationsViewed(
      params.currentEmployeeId,
      params.ids
    );
  }
}
