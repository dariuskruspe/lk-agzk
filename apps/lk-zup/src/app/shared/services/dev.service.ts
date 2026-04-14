import { inject, Injectable, signal } from '@angular/core';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { StorageService } from '@shared/services/storage.service';
import { logDebug } from '@shared/utilits/logger';
import set from 'lodash/set';
import { isDev } from '../utilits/is-dev';
import { LayoutService } from '@app/layout/layout.service';
import { SettingsThemeFacade } from '@shared/features/settings/facades/settings-theme.facade';
import { LocalStorageService } from './local-storage.service';
import { UserStateService } from '@shared/states/user-state.service';
import { Environment } from '../classes/ennvironment/environment';

@Injectable({ providedIn: 'root' })
export class DevService {
  private storageService: StorageService = inject(StorageService);
  private localStorageService: LocalStorageService =
    inject(LocalStorageService);
  private userStateService: UserStateService = inject(UserStateService);
  private layout = inject(LayoutService);
  private settingsThemeFacade = inject(SettingsThemeFacade);
  private overrideSettings: Record<string, any> = {};

  isDevModeEnabled = signal(isDev() || localStorage.getItem('dev') === 'true');
  selectedModel = signal('anthropic/claude-sonnet-4.5');

  constructor() {
    if (this.isDevModeEnabled() && localStorage.getItem('overrideSettings')) {
      this.overrideSettings = JSON.parse(
        localStorage.getItem('overrideSettings'),
      );
    }

    if (this.isDevModeEnabled()) {
      // Загружаем сохраненную модель из localStorage
      const savedModel = localStorage.getItem('devSelectedModel');
      if (savedModel) {
        this.selectedModel.set(savedModel);
      }
    }

    if (this.hasOverrideSettings()) {
      logDebug('Dev.overrideSettings', this.overrideSettings);
    }

    (window as any).dev = {
      setLayout: (layout: string) => {
        this.layout.setLayout(layout);
      },
      getLayout: () => {
        return this.layout.layout();
      },
      setTheme: (theme: string) => {
        this.settingsThemeFacade.setTheme(theme);
      },
      getTheme: () => {
        return this.settingsThemeFacade.theme();
      },
      enable: () => {
        localStorage.setItem('dev', 'true');
        this.isDevModeEnabled.set(true);
      },
      disable: () => {
        localStorage.removeItem('dev');
        this.isDevModeEnabled.set(false);
      },
      isEnabled: () => {
        return localStorage.getItem('dev') === 'true';
      },
      setting: (key: string) => ({
        override: (value: any) => {
          this.overrideSettings[key] = value;
          this.saveSettingOverrides();
        },
        reset: () => {
          delete this.overrideSettings[key];
          this.saveSettingOverrides();
        },
      }),

      showSettings: () => {
        logDebug(
          'Settings:',
          this.storageService.storage.settings.data.frontend.signal.globalSettings(),
        );
      },

      showOverrideSettings: () => {
        logDebug('Dev.overrideSettings', this.overrideSettings);
      },

      resetAllOverrides: () => {
        this.overrideSettings = {};
        this.saveSettingOverrides();
      },

      setModel: (modelName: string) => {
        this.setModel(modelName);
      },

      getModel: () => {
        return this.getModel();
      },

      getSession: () => {
        return this.getSession();
      },
    };
  }

  private saveSettingOverrides() {
    logDebug('Dev: saveSettingOverrides', this.overrideSettings);
    localStorage.setItem(
      'overrideSettings',
      JSON.stringify(this.overrideSettings),
    );
  }

  hasOverrideSettings() {
    return Object.keys(this.overrideSettings).length > 0;
  }

  applyOverrideSettings(settings: SettingsInterface) {
    logDebug('Dev: applyOverrideSettings', this.overrideSettings);
    for (const [key, value] of Object.entries(this.overrideSettings)) {
      set(settings, key, value);
      logDebug('Dev: patch setting', key, value);
    }
  }

  setModel(modelName: string) {
    this.selectedModel.set(modelName);
    localStorage.setItem('devSelectedModel', modelName);
    logDebug('Dev: model changed to', modelName);
  }

  getModel(): string {
    return this.selectedModel();
  }

  getSession() {
    return {
      employeeId: this.localStorageService.getCurrentEmployeeId(),
      accessToken: this.localStorageService.getTokens(),
      userId: this.userStateService.current()?.userID
    }
  }
}
