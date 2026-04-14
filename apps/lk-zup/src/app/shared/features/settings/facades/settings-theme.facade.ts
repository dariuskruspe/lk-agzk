import { computed, inject, Injectable, signal } from '@angular/core';
import {
  APP_THEMES,
  getThemeDetail,
  resolveTheme,
} from '../constants/theme.config';
import {
  AppThemeId,
  ThemeDataAttrValue,
  ThemeStylesheetId,
} from '../models/theme.model';
import { LocalStorageService } from '../../../services/local-storage.service';
import { StorageService } from '@shared/services/storage.service';
import { SettingsThemeClass } from '../classes/settings-theme.class';
import { LiquidConfig } from '@shared/features/liquid/liquid-config';

@Injectable({
  providedIn: 'root',
})
export class SettingsThemeFacade {
  private localstorageService = inject(LocalStorageService);
  private storageService = inject(StorageService);
  private settingsThemeClass = inject(SettingsThemeClass);
  private liquidConfig = inject(LiquidConfig);

  themes = signal(APP_THEMES).asReadonly();

  theme = signal<AppThemeId | ''>('');
  themeDetail = computed(() => this.getThemeDetail(this.theme()));

  constructor() {
    const theme = this.localstorageService.getTheme();
    this.setTheme(theme);
  }

  setTheme(theme?: string | null): void {
    const resolvedTheme = resolveTheme(theme);
    const currentTheme = this.theme();

    if (currentTheme !== resolvedTheme) {
      const detail = this.getThemeDetail(resolvedTheme);
      this.liquidConfig.enabled.set(detail.liquid);
      this.changeBaseTheme(detail.base, detail.dataTheme);

      this.setBodyThemeClass(detail.value);
      this.localstorageService.setTheme(detail.value);
      this.storageService.storage.settings.data.frontend.signal.theme.set(
        detail.value,
      );
      this.theme.set(detail.value);
    }
  }

  changeBaseTheme(
    baseTheme: ThemeStylesheetId,
    dataTheme: ThemeDataAttrValue,
  ): void {
    this.settingsThemeClass.removeStyle();
    this.settingsThemeClass.setStyle(baseTheme);
    this.settingsThemeClass.setThemeDataAttr(dataTheme);
  }

  private getThemeDetail(name?: string | null) {
    return getThemeDetail(name);
  }

  private setBodyThemeClass(theme: string) {
    for (const className of document.body.classList) {
      if (className.startsWith('app-theme-')) {
        document.body.classList.remove(className);
      }
    }
    document.body.classList.add(`app-theme-${theme}`);
  }
}
