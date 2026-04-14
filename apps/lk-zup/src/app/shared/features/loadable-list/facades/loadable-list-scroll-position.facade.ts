import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../classes/abstractions/abstract.facade';
import { LoadableListScrollPositionState } from '../states/loadable-list-scroll-position.state';

@Injectable({
  providedIn: 'root',
})
export class LoadableListScrollPositionFacade extends AbstractFacade<{
  position: number;
}> {
  constructor(
    protected geRx: GeRx,
    protected store: LoadableListScrollPositionState
  ) {
    super(geRx, store);
  }

  clearStore(): void {
    this.geRx.cleanEntity(this.store.entityName);
  }

  savePosition(position: number): void {
    this.geRx.edit(this.store.entityName, position);
  }
}
