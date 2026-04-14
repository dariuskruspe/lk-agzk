import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { VacationsGraphEditPeriodsState } from '../states/vacations-graph-edit-periods.state';

@Injectable({
  providedIn: 'root',
})
export class VacationsGraphEditPeriodsFacade extends AbstractFacade<unknown> {
  constructor(
    protected geRx: GeRx,
    protected store: VacationsGraphEditPeriodsState
  ) {
    super(geRx, store);
  }
}
