import { Injectable } from '@angular/core';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { SettingsApiService } from '@shared/features/settings/services/settings-api.service';
import { SettingsStates } from '@shared/features/settings/states/settings.states';
import { UserSettingsInterface } from '@shared/models/menu-condition.interface';
import { DevService } from '@shared/services/dev.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { firstValueFrom } from 'rxjs';

/**
 * Вспомогательный сервис для работы с настройками приложения (системы "ЛКС").
 */
@Injectable({ providedIn: 'root' })
export class SettingsService {
  constructor(
    // Other
    private dev: DevService,
    private localStorageService: LocalStorageService,
    public settingsAPI: SettingsApiService,
    public settingsState: SettingsStates,
  ) {}

  async globalSettingsHandler(): Promise<SettingsInterface> {
    const settings: SettingsInterface = await firstValueFrom(
      this.settingsAPI.getSettings(),
    );

    if (!settings) return;

    // перенесено из settings.states.ts
    if (this.dev.hasOverrideSettings()) {
      this.dev.applyOverrideSettings(settings);
    }

    this.settingsState.setTheme(settings);
    this.settingsState.setLang(settings);

    this.localStorageService.setSettings(settings);

    return settings;
  }

  async userSettingsHandler(): Promise<UserSettingsInterface> {
    const userSettings: UserSettingsInterface = await firstValueFrom(
      this.settingsAPI.getUserSettings(),
    );

    if (!userSettings) return;

    this.localStorageService.setUserSettings(userSettings);

    return userSettings;
  }
}
