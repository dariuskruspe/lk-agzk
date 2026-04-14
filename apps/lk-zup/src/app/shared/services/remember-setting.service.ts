import { Injectable } from '@angular/core';
import cloneDeep from 'lodash/cloneDeep';

const STORAGE_KEY = 'local_settings';

@Injectable({
  providedIn: 'root',
})
export class RememberSettingService {
  settings: Record<string, any> = {};

  constructor() {
    try {
      this.settings = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    } catch {
      this.settings = {};
    }
  }

  readonly lastProvider = this.setting<string>('last_provider');

  readonly lastUsedSignCertificate = this.setting<string>(
    'last_used_sign_certificate',
  );

  private setting<T = any>(key: string) {
    return {
      get: () => this.get<T>(key),
      remember: (value: T) => this.remember(key, value),
      clear: () => this.remember(key, undefined),
    };
  }

  private remember(key: string, value: any) {
    this.settings[key] = value;
    this.save();
  }

  private get<T>(key: string): T | undefined {
    return this.settings[key] ? cloneDeep(this.settings[key]) : undefined;
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
  }
}
