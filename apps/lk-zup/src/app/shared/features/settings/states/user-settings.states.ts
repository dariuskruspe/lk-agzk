import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';
import { UserSettingsInterface } from '../../../models/menu-condition.interface';
import { LocalStorageService } from '../../../services/local-storage.service';
import { SettingsApiService } from '../services/settings-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsStates {
  public entityName = 'userSettings';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.showUserSettings,
      success: this.successShowUserSettings,
    },
  };

  constructor(
    private settingsAPI: SettingsApiService,
    private localstorageService: LocalStorageService
  ) {}

  showUserSettings(): Observable<UserSettingsInterface> {
    return this.settingsAPI.getUserSettings();
  }

  successShowUserSettings(res: UserSettingsInterface): Observable<void> {
    this.localstorageService.setUserSettings(res);
    return of();
  }
}
