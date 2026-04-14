import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { VacationsInterface } from '../models/vacations.interface';
import { VacationsGraphPeriodsState } from '../states/vacations-graph-periods.state';

@Injectable({
  providedIn: 'root',
})
export class VacationsGraphPeriodsFacade extends AbstractFacade<
  VacationsInterface[]
> {
  constructor(
    protected geRx: GeRx,
    protected store: VacationsGraphPeriodsState
  ) {
    super(geRx, store);
  }
}
