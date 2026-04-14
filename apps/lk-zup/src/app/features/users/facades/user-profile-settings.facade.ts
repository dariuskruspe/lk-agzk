import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { UserProfileSettingsState } from '../states/user-profile-settings.state';

@Injectable({
  providedIn: 'root',
})
export class UsersProfileSettingsFacade extends AbstractFacade<unknown> {
  constructor(protected geRx: GeRx, protected store: UserProfileSettingsState) {
    super(geRx, store);
  }
}
