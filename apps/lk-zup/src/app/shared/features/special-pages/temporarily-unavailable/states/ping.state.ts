import { Injectable } from '@angular/core';
import { SettingsApiService } from '@shared/features/settings/services/settings-api.service';
import { PingService } from '@shared/features/special-pages/temporarily-unavailable/services/ping.service';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PingState {
  public entityName = 'ping';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.showSettings,
      success: this.onSuccess,
      error: this.onError,
    },
  };

  constructor(
    private settingsAPI: SettingsApiService,
    private ping: PingService
  ) {}

  showSettings(): Observable<unknown> {
    return this.settingsAPI.getSettings();
  }

  onSuccess(): Observable<boolean> {
    this.ping.setPing(true);
    return of(true);
  }

  onError(): Observable<boolean> {
    this.ping.setPing(false);
    return of(false);
  }
}
