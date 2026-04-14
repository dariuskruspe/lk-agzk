import { computed, inject, Injectable } from '@angular/core';
import { injectResource } from '../services/api-resource/utils';
import { GlobalSettingsResource } from '../api-resources/global-settings.resource';
import { DevService } from '../services/dev.service';
import { SettingsInterface } from '../features/settings/models/settings.interface';

@Injectable({
  providedIn: 'root',
})
export class GlobalSettingsStateService {
  private readonly resource = injectResource(GlobalSettingsResource).asSignal();
  private dev = inject(DevService);

  readonly state = computed(() => {
    const data = this.resource.data();

    if (!data) {
      return null;
    }

    const settings = JSON.parse(JSON.stringify(data));

    if (this.dev.isDevModeEnabled()) {
      this.dev.applyOverrideSettings(settings);
    }

    return settings as SettingsInterface;
  });
  readonly loading = this.resource.loading;
  readonly error = this.resource.error;

  async loadOnce() {
    if (this.resource.data()) {
      return;
    }

    await this.resource.fetch();
  }
}
