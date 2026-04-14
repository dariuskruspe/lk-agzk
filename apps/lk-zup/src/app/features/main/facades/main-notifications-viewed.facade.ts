import { Injectable } from '@angular/core';
import { MainNotificationsViewedState } from '@features/main/states/main-notifications-viewed.state';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';

@Injectable({
  providedIn: 'root',
})
export class MainNotificationsViewedFacade extends AbstractFacade<string[]> {
  constructor(
    protected geRx: GeRx,
    protected store: MainNotificationsViewedState,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  setNotificationsViewed(ids: string[]): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.exception({ currentEmployeeId, ids });
  }
}
