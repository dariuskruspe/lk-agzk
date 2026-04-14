import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../classes/abstractions/abstract.facade';
import { UserSettingsInterface } from '../../../models/menu-condition.interface';
import { UserSettingsStates } from '../states/user-settings.states';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsFacade extends AbstractFacade<UserSettingsInterface> {
  constructor(protected geRx: GeRx, protected store: UserSettingsStates) {
    super(geRx, store);
  }

  showUserSettings(): void {
    this.geRx.show(this.store.entityName);
  }
}
