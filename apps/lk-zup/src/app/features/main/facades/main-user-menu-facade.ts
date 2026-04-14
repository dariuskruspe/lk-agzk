import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { MainUserMenuState } from '../states/main-user-menu.state';

@Injectable({
  providedIn: 'root',
})
export class MainUserMenuFacade extends AbstractFacade<boolean> {
  constructor(protected geRx: GeRx, protected store: MainUserMenuState) {
    super(geRx, store);
  }

  setUserMenuState(isOpened: boolean): void {
    this.exception(isOpened);
  }
}
