import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Environment } from '../classes/ennvironment/environment';
import { SettingsFacade } from '../features/settings/facades/settings.facade';

@Injectable({
  providedIn: 'root',
})
export class HrPresentationSsoService {
  private settingsFacade = inject(SettingsFacade);

  private http = inject(HttpClient);

  loading = signal(false);

  error = signal<{ stage: string; error: Error } | null>(null);

  async requestAuth() {
    this.error.set(null);
    this.loading.set(true);

    let jwtToken: string;

    try {
      jwtToken = await firstValueFrom(this.requestHrPortalJwtToken());
    } catch (e) {
      this.error.set({
        stage: 'jwt-request',
        error: e,
      });

      throw e;
    } finally {
      this.loading.set(false);
    }

    try {
      return await firstValueFrom(this.requestHrPortalSsoAuth(jwtToken));
    } catch (e) {
      this.error.set({
        stage: 'sso-request',
        error: e,
      });
      throw e;
    } finally {
      this.loading.set(false);
    }
  }

  private requestHrPortalJwtToken() {
    return this.http.get<string>(
      `${Environment.inv().api}/wa_users/portalToken`
    );
  }

  private requestHrPortalSsoAuth(jwtToken: string) {
    return this.http.post<{ redirectUrl: string }>(
      `${this.getHrPortalUrl()}/api/auth/sso`,
      {
        jwtToken,
      }
    );
  }

  private getHrPortalUrl() {
    const { general } = this.settingsFacade.getData();

    return general.hrPortalUrl ?? Environment.inv().hrPortalUrl;
  }
}
