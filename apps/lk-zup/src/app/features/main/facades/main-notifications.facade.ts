import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { MainNotificationsInterface } from '../models/main-notifications.interface';
import { MainNotificationsState } from '../states/main-notifications.state';

@Injectable({
  providedIn: 'root',
})
export class MainNotificationsFacade extends AbstractFacade<
  MainNotificationsInterface[] | { success: true }
> {
  constructor(
    protected geRx: GeRx,
    protected store: MainNotificationsState,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getNotifications(): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.show(currentEmployeeId);
  }

  deleteNotifications(id: string): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.delete({ id, currentEmployeeId });
  }

  deleteNotificationsAll(): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.exception(currentEmployeeId);
  }
}
