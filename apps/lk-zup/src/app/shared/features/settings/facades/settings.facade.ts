import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../classes/abstractions/abstract.facade';
import { SettingsInterface } from '../models/settings.interface';
import { SettingsStates } from '../states/settings.states';

@Injectable({
  providedIn: 'root',
})
export class SettingsFacade extends AbstractFacade<SettingsInterface> {
  constructor(protected geRx: GeRx, protected store: SettingsStates) {
    super(geRx, store);
  }

  showSettings(): void {
    this.geRx.show(this.store.entityName);
  }
}
