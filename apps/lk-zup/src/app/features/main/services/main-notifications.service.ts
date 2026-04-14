import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import {
  MainNotificationInterface,
  MainNotificationsInterface,
} from '../models/main-notifications.interface';

@Injectable({
  providedIn: 'root',
})
export class MainNotificationsService {
  constructor(private http: HttpClient) {}

  getUnreadNotificationsCount(currentEmployeeId: string) {
    return this.http.get<{ total: number; unread: number }>(
      `${Environment.inv().api}/wa_employee/${currentEmployeeId}/notifications/all/count`,
    );
  }

  getNotifications(
    currentEmployeeId: string,
  ): Observable<MainNotificationsInterface[]> {
    return this.http.get<MainNotificationsInterface[]>(
      `${
        Environment.inv().api
      }/wa_employee/${currentEmployeeId}/notifications/all`,
    );
  }

  deleteNotifications(
    data: MainNotificationInterface,
  ): Observable<{ success: true }> {
    return this.http.delete<{ success: true }>(
      `${Environment.inv().api}/wa_employee/${
        data.currentEmployeeId
      }/notifications/${data.id}`,
    );
  }

  deleteNotificationsAll(
    currentEmployeeId: string,
  ): Observable<{ success: true }> {
    return this.http.delete<{ success: true }>(
      `${
        Environment.inv().api
      }/wa_employee/${currentEmployeeId}/notifications/all`,
    );
  }

  setNotificationsViewed(
    currentEmployeeId: string,
    ids: string[],
  ): Observable<string[]> {
    return this.http.post<string[]>(
      `${
        Environment.inv().api
      }/wa_employee/${currentEmployeeId}/notifications/viewed`,
      { notifications: ids },
    );
  }
}
