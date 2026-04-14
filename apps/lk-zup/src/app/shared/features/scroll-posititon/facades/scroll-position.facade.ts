import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../classes/abstractions/abstract.facade';
import { ScrollPositionState } from '../states/scroll-position.state';

@Injectable({
  providedIn: 'root',
})
export class ScrollPositionFacade extends AbstractFacade<{ position: number }> {
  constructor(protected geRx: GeRx, protected store: ScrollPositionState) {
    super(geRx, store);
  }

  clearStore(): void {
    this.geRx.cleanEntity(this.store.entityName);
  }

  getPosition(position: number): void {
    this.geRx.edit(this.store.entityName, position);
  }
}
