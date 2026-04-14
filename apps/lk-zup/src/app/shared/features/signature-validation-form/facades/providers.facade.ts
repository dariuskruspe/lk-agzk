import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../classes/abstractions/abstract.facade';
import { ProvidersInterface } from '../models/providers.interface';
import { ProvidersState } from '../states/providers.state';

@Injectable({
  providedIn: 'root',
})
export class ProvidersFacade extends AbstractFacade<ProvidersInterface> {
  constructor(protected geRx: GeRx, protected store: ProvidersState) {
    super(geRx, store);
  }
}
