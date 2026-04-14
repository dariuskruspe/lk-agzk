import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { VacationsStatesInterface } from '../models/vacations-states.interface';
import { VacationsStatesState } from '../states/vacations-states.state';

@Injectable({
  providedIn: 'root',
})
export class VacationsStatesFacade extends AbstractFacade<VacationsStatesInterface> {
  constructor(protected geRx: GeRx, protected store: VacationsStatesState) {
    super(geRx, store);
  }
}
