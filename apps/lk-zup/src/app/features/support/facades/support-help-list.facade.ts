import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { SupportHelpMainInterface } from '../models/support-help.interface';
import { SupportHelpBlock } from '../states/support-help-block.state';

@Injectable({
  providedIn: 'root',
})
export class SupportHelpListFacade extends AbstractFacade<SupportHelpMainInterface> {
  constructor(protected geRx: GeRx, protected store: SupportHelpBlock) {
    super(geRx, store);
  }

  getSupportHelpList(pageId: string): void {
    this.geRx.show(this.store.entityName, pageId);
  }
}
