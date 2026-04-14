import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import {
  MainNotificationInterface,
  MainNotificationsInterface,
} from '../models/main-notifications.interface';
import { MainNotificationsService } from '../services/main-notifications.service';

@Injectable({
  providedIn: 'root',
})
export class MainNotificationsState {
  public entityName = 'mainNotifications';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getNotifications,
    },
    delete: {
      main: this.deleteNotifications,
    },
    exception: {
      main: this.deleteNotificationsAll,
    },
  };

  constructor(private mainNotificationsService: MainNotificationsService) {}

  getNotifications(
    currentEmployeeId: string
  ): Observable<MainNotificationsInterface[]> {
    return this.mainNotificationsService.getNotifications(currentEmployeeId);
  }

  deleteNotifications(
    data: MainNotificationInterface
  ): Observable<{ success: true }> {
    return this.mainNotificationsService.deleteNotifications(data);
  }

  deleteNotificationsAll(
    currentEmployeeId: string
  ): Observable<{ success: true }> {
    return this.mainNotificationsService.deleteNotificationsAll(
      currentEmployeeId
    );
  }
}
