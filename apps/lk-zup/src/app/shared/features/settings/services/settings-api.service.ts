import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../classes/ennvironment/environment';
import { UserSettingsInterface } from '../../../models/menu-condition.interface';
import { SettingsInterface } from '../models/settings.interface';
import { injectResource } from '@app/shared/services/api-resource/utils';
import { UserSectionSettingsResource } from '@app/shared/api-resources/user-section-settings.resource';
import { GlobalSettingsResource } from '@app/shared/api-resources/global-settings.resource';

@Injectable({
  providedIn: 'root',
})
export class SettingsApiService {
  userSectionSettingsResource = injectResource(UserSectionSettingsResource);
  globalSettingsResource = injectResource(GlobalSettingsResource);
  constructor(private http: HttpClient) {}

  getSettings(): Observable<SettingsInterface> {
    return this.globalSettingsResource.asObservable();
  }

  getUserSettings(): Observable<UserSettingsInterface> {
    return this.userSectionSettingsResource.asObservable();
  }
}
