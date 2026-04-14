import { Injectable } from '@angular/core';
import { injectResource } from '../services/api-resource/utils';
import { UserSectionSettingsResource } from '../api-resources/user-section-settings.resource';

@Injectable({
  providedIn: 'root',
})
export class SectionSettingsStateService {
  private resource = injectResource(UserSectionSettingsResource).asSignal();

  readonly state = this.resource.data;
  readonly loading = this.resource.loading;
  readonly error = this.resource.error;

  async loadOnce() {
    if (this.resource.data()) {
      return;
    }

    await this.resource.fetch();
  }
}
