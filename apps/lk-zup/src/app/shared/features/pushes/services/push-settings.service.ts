import { Injectable } from '@angular/core';
import { PushSettingsInterface } from '../interfaces/push-settings.interface';

@Injectable()
export class PushSettingsService {
  get(): PushSettingsInterface {
    const defaultSettings = {
      isNeverShow: false,
      declinedAt: null,
    };

    try {
      const settings = JSON.parse(localStorage.getItem('pushSettings'));
      return settings || defaultSettings;
    } catch {
      return defaultSettings;
    }
  }

  setDeclinedAt(date: Date): Promise<void> {
    return this.setPushSettings({
      isNeverShow: false,
      declinedAt: date.getTime(),
    });
  }

  setNeverShowMore(): Promise<void> {
    return this.setPushSettings({
      isNeverShow: true,
      declinedAt: null,
    });
  }

  private async setPushSettings(settings: PushSettingsInterface) {
    localStorage.setItem('pushSettings', JSON.stringify(settings));
  }
}
