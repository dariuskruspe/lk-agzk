import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { MainSidebarState } from '../states/main-sidebar.state';

@Injectable({
  providedIn: 'root',
})
export class MainSidebarFacade extends AbstractFacade<boolean> {
  constructor(protected geRx: GeRx, protected store: MainSidebarState) {
    super(geRx, store);
  }

  setSidebarState(isOpened: boolean): void {
    this.exception(isOpened);
  }
}
