import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { UserProfileSettings } from '../models/user-profile-settings';

@Injectable({
  providedIn: 'root',
})
export class UserProfileSettingsService {
  constructor(private http: HttpClient) {}

  addSettings(
    settingsData: UserProfileSettings
  ): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      `${Environment.inv().api}/wa_users/sectionsSettings`,
      settingsData
    );
  }
}
