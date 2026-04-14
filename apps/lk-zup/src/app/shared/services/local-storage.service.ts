import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import Version from '../../../version/version.json';
import { AuthTokenInterface } from '../../features/auth/models/auth-login.interface';
import { CachedBreadcrumbsInterface } from '../../features/main/models/main-breadcrumbs.interface';
import { LangInterface } from '../features/lang/interfaces/lang.interface';
import { SettingsInterface } from '../features/settings/models/settings.interface';
import { AppThemeId } from '../features/settings/models/theme.model';
import { UserSettingsInterface } from '../models/menu-condition.interface';
import { LocalStorageKeysGeneratorUtils } from '../utilits/local-storage-keys-generator-utils.service';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private ver = Version;

  private lang = 'ru';

  constructor(private keyGen: LocalStorageKeysGeneratorUtils) {}

  setTokens(data: AuthTokenInterface): void {
    localStorage.setItem(this.keyGen.storageKey('token'), data.token);
  }

  getTokens(): string | null {
    return localStorage.getItem(this.keyGen.storageKey('token'));
  }

  clearTokens(): void {
    localStorage.removeItem(this.keyGen.storageKey('token'));
    localStorage.removeItem(this.keyGen.storageKey('employeeId'));
  }

  setCurrentEmployeeId(employeeID: string): void {
    localStorage.setItem(this.keyGen.storageKey('employeeId'), employeeID);
  }

  getCurrentEmployeeId(): string | null {
    return localStorage.getItem(this.keyGen.storageKey('employeeId'));
  }

  setCurrentLang(lang: LangInterface): 'ru' | 'en' {
    this.lang = lang.languageCode;
    localStorage.setItem(this.keyGen.storageKey('lang'), lang.languageCode);
    return lang.languageCode;
  }

  setLang(lang: string): string {
    this.lang = lang;
    localStorage.setItem(this.keyGen.storageKey('lang'), lang);
    return lang;
  }

  getCurrentLang(): string | null {
    let lang = localStorage.getItem(this.keyGen.storageKey('lang'));
    if (!lang) {
      // eslint-disable-next-line prefer-destructuring
      lang = this.lang;
      this.setLang(lang);
    }
    return lang;
  }

  getTheme(): string | null {
    const theme = localStorage.getItem(this.keyGen.storageKey('theme'));
    return theme === 'null' ? null : theme;
  }

  setTheme(name: AppThemeId): void {
    localStorage.setItem(this.keyGen.storageKey('theme'), name);
  }

  setAuthType(type: 'sso' | 'sms' | 'login'): void {
    localStorage.setItem(this.keyGen.storageKey('authType'), type);
  }

  getAuthType(): string {
    return localStorage.getItem(this.keyGen.storageKey('authType'));
  }

  clearAuthType(): void {
    localStorage.removeItem(this.keyGen.storageKey('authType'));
  }

  saveBreadcrumbs(items: CachedBreadcrumbsInterface[]): void {
    sessionStorage.setItem(
      this.keyGen.storageKey('breadcrumbs'),
      JSON.stringify(items),
    );
  }

  getBreadcrumbs(): CachedBreadcrumbsInterface[] | null {
    try {
      return JSON.parse(
        sessionStorage.getItem(this.keyGen.storageKey('breadcrumbs')),
      );
    } catch (e) {
      return null;
    }
  }

  getVersion(): string {
    return localStorage.getItem(this.keyGen.storageKey('version'));
  }

  setVersion(): void {
    localStorage.setItem(
      this.keyGen.storageKey('version'),
      `${this.ver?.version}-${this.ver?.type}`,
    );
  }

  isOnboardingSkipped(name: string): boolean {
    return (
      localStorage.getItem(this.keyGen.storageKey(`onb-skipped__${name}`)) ===
      'true'
    );
  }

  setOnboardingSkipped(value: boolean, name: string): void {
    localStorage.setItem(
      this.keyGen.storageKey(`onb-skipped__${name}`),
      value ? value.toString() : '',
    );
  }

  isOnboardingFinished(name: string): boolean {
    return (
      localStorage.getItem(this.keyGen.storageKey(`onb-finished__${name}`)) ===
      'true'
    );
  }

  setOnboardingFinished(value: boolean, name: string): void {
    localStorage.setItem(
      this.keyGen.storageKey(`onb-finished__${name}`),
      value ? value.toString() : '',
    );
  }

  getOnboardingStep(name: string): number {
    return (
      +localStorage.getItem(this.keyGen.storageKey(`onb-cur-pos__${name}`)) || 0
    );
  }

  setOnboardingStep(value: number, name: string): void {
    localStorage.setItem(
      this.keyGen.storageKey(`onb-cur-pos__${name}`),
      value.toString(),
    );
  }

  clearOnboardingStep(name: string): void {
    localStorage.removeItem(this.keyGen.storageKey(`onb-cur-pos__${name}`));
  }

  setSettings(settings: SettingsInterface): void {
    localStorage.setItem(
      this.keyGen.storageKey('settings'),
      JSON.stringify(settings),
    );
  }

  getSettings(): SettingsInterface | null {
    return JSON.parse(localStorage.getItem(this.keyGen.storageKey('settings')));
  }

  clearSettings(): void {
    localStorage.removeItem(this.keyGen.storageKey('settings'));
  }

  setUserSettings(settings: UserSettingsInterface): void {
    localStorage.setItem(
      this.keyGen.storageKey('user-settings'),
      JSON.stringify(settings),
    );
  }

  getUserSettings(): UserSettingsInterface | null {
    return JSON.parse(
      localStorage.getItem(this.keyGen.storageKey('user-settings')),
    );
  }

  clearUserSettings(): void {
    localStorage.removeItem(this.keyGen.storageKey('user-settings'));
  }

  setHasUnsignedDocuments(length: number): void {
    localStorage.setItem(this.keyGen.storageKey('doc-len'), length.toString());
  }

  getHasUnsignedDocuments(): boolean | null {
    return localStorage.getItem(this.keyGen.storageKey('doc-len')) !== '0';
  }

  clearHasUnsignedDocuments(): void {
    localStorage.removeItem(this.keyGen.storageKey('doc-len'));
  }

  getPreviousBlockedUrl(): string | null {
    return localStorage.getItem(this.keyGen.storageKey('saved_url'));
  }

  setPreviousBlockedUrl(url: string): void {
    localStorage.setItem(this.keyGen.storageKey('saved_url'), url);
  }

  getPreviousBlockedUrlParams(): { [p: string]: any } | null {
    return JSON.parse(
      localStorage.getItem(this.keyGen.storageKey('saved_url_params')),
    );
  }

  setPreviousBlockedUrlParams(params: { [p: string]: any }): void {
    localStorage.setItem(
      this.keyGen.storageKey('saved_url_params'),
      JSON.stringify(params),
    );
  }

  clearPreviousBlockedUrl(): void {
    localStorage.removeItem(this.keyGen.storageKey('saved_url'));
    localStorage.removeItem(this.keyGen.storageKey('saved_url_params'));
  }

  setSidebarCollapsed(collapsed: boolean): void {
    localStorage.setItem('sidebar-collapsed', collapsed.toString());
  }

  getSidebarCollapsed(): boolean {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  }

  getUseOldDashboard(): boolean {
    return localStorage.getItem('use-old-dashboard') === 'true';
  }

  setUseOldDashboard(value: boolean) {
    localStorage.setItem('use-old-dashboard', value.toString());
  }
}
