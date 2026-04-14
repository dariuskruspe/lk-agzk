import { Component, inject, WritableSignal } from '@angular/core';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { SettingsStorageInterface } from '@shared/interfaces/storage/settings/settings-storage.interface';
import { AppService } from '@shared/services/app.service';
import Version from '@version/version.json';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: false
})
export class FooterComponent {
  app: AppService = inject(AppService);

  settingsStorage: SettingsStorageInterface = this.app.storage.settings;

  settings: WritableSignal<SettingsInterface> =
    this.settingsStorage.data.frontend.signal.globalSettings;

  public ver = Version;
}
