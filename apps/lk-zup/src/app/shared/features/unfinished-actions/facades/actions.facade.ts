import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../classes/abstractions/abstract.facade';
import { ActionsState } from '../states/actions.state';

@Injectable({
  providedIn: 'root',
})
export class ActionsFacade extends AbstractFacade<void> {
  constructor(protected geRx: GeRx, protected store: ActionsState) {
    super(geRx, store);
  }
}
