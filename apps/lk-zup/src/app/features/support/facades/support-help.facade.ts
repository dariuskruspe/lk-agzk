import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { SupportHelpItemInterface } from '../models/support-help.interface';
import { SupportHelpState } from '../states/support-help.state';

@Injectable({
  providedIn: 'root',
})
export class SupportHelpFacade extends AbstractFacade<
  SupportHelpItemInterface[]
> {
  constructor(protected geRx: GeRx, protected store: SupportHelpState) {
    super(geRx, store);
  }

  getSupportHelpList(): void {
    this.geRx.show(this.store.entityName);
  }
}
