import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { SupportHelpMenuInterface } from '../models/support-help.interface';
import { SupportHelpSideMenu } from '../states/support-help-side-menu.state';

@Injectable({
  providedIn: 'root',
})
export class SupportHelpSideMenuFacade extends AbstractFacade<
  SupportHelpMenuInterface[]
> {
  constructor(protected geRx: GeRx, protected store: SupportHelpSideMenu) {
    super(geRx, store);
  }

  getSupportHelpSideMenu(groupId: string): void {
    this.geRx.show(this.store.entityName, groupId);
  }
}
