import { inject, Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import {
  Employees,
  MainCurrentUserInterface,
} from '../models/main-current-user.interface';
import { MainCurrentUserState } from '../states/main-current-user.state';

@Injectable({
  providedIn: 'root',
})
export class MainCurrentUserFacade extends AbstractFacade<MainCurrentUserInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: MainCurrentUserState,
    protected localstorageService: LocalStorageService,
  ) {
    super(geRx, store);
  }

  getCurrentUser(): void {
    this.geRx.exception(this.store.entityName);
  }

  getLang(): string {
    return this.localstorageService.getCurrentLang();
  }

  getCurrentEmployee(): Employees {
    const emplId = this.localstorageService.getCurrentEmployeeId();
    return this.getData().employees.find((v) => v.employeeID === emplId);
  }
}
