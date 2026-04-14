import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../classes/abstractions/abstract.facade';
import { OptionListInterface } from '../models/option-list.interface';
import { OptionListState } from '../states/option-list.state';

@Injectable({
  providedIn: 'root',
})
export class OptionListFacade extends AbstractFacade<OptionListInterface> {
  constructor(protected geRx: GeRx, protected store: OptionListState) {
    super(geRx, store);
  }

  showOptionLists(aliases: string[], employeeId?: string): void {
    this.geRx.show(this.store.entityName, { aliases, employeeId });
  }
}
