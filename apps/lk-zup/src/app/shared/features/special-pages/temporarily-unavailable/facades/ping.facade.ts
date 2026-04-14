import { Injectable } from '@angular/core';
import { AbstractFacade } from '@shared/classes/abstractions/abstract.facade';
import { PingState } from '@shared/features/special-pages/temporarily-unavailable/states/ping.state';
import { GeRx } from 'gerx';

@Injectable({
  providedIn: 'root',
})
export class PingFacade extends AbstractFacade<unknown> {
  constructor(protected geRx: GeRx, protected store: PingState) {
    super(geRx, store);
  }
}
