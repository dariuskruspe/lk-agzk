import { Component } from '@angular/core';
import { SettingsThemeClass } from '../../settings/classes/settings-theme.class';

@Component({
    template: '',
    standalone: false
})
export class MobileInitializerComponent {
  constructor(private settingsTheme: SettingsThemeClass) {
    this.settingsTheme.setMobileAttr();
    // eslint-disable-next-line no-console
    console.log('Mobile module imported!');
  }
}
