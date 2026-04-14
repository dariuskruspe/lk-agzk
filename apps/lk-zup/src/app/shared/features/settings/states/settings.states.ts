import { Injectable } from '@angular/core';
import { DevService } from '@shared/services/dev.service';
import { GeRxMethods } from 'gerx/index.interface';
import { PrimeNGConfig } from 'primeng/api';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CALENDER_CONFIG_EN,
  CALENDER_CONFIG_RU,
} from '../../../dictionaries/calendar-locale.dictionary';
import { LocalStorageService } from '../../../services/local-storage.service';
import { isNil } from '../../../utilits/is-nil.util';
import { Analytic } from '../classes/analytic.class';
import { SettingsThemeClass } from '../classes/settings-theme.class';
import { SettingsInterface } from '../models/settings.interface';
import { SettingsApiService } from '../services/settings-api.service';
import { SettingsThemeFacade } from '../facades/settings-theme.facade';

@Injectable({
  providedIn: 'root',
})
export class SettingsStates {
  public entityName = 'settings';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.showSettings,
      success: this.successShowSettings,
    },
  };

  constructor(
    private settingsAPI: SettingsApiService,
    private localstorageService: LocalStorageService,
    private settingsThemeFacade: SettingsThemeFacade,
    private config: PrimeNGConfig,
    private dev: DevService,
  ) {}

  showSettings(): Observable<SettingsInterface> {
    return this.settingsAPI.getSettings().pipe(
      map((data) => {
        if (this.dev.hasOverrideSettings()) {
          this.dev.applyOverrideSettings(data);
        }

        return data;
      }),
    );
  }

  successShowSettings(res: SettingsInterface): Observable<void> {
    this.setTheme(res);
    this.setLang(res);
    this.localstorageService.setSettings(res);
    return of();
  }

  setTheme(param: SettingsInterface): void {
    const theme = param?.header?.themeButton?.enable
      ? this.localstorageService.getTheme() ?? param?.general?.visualTheme
      : param?.general?.visualTheme;

    this.settingsThemeFacade.setTheme(theme);
  }

  setLang(param: SettingsInterface): void {
    if (param?.header?.langButton?.enable) {
      this.localstorageService.setLang(
        isNil(this.localstorageService.getCurrentLang())
          ? param?.general?.languageCode
          : this.localstorageService.getCurrentLang(),
      );
    } else {
      this.localstorageService.setLang(param?.general?.languageCode);
    }
    if (this.localstorageService.getCurrentLang() === 'en') {
      this.config.setTranslation(CALENDER_CONFIG_EN);
    }
    if (this.localstorageService.getCurrentLang() === 'ru') {
      this.config.setTranslation(CALENDER_CONFIG_RU);
    }
  }
}
