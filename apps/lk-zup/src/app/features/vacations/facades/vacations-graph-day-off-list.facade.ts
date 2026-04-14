import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { VacationsGraphDayOffListInterface } from '../models/vacations-graph-day-off-list.interface';
import { VacationsGraphDayOffListState } from '../states/vacations-graph-day-off-list.state';

@Injectable({
  providedIn: 'root',
})
export class VacationsGraphDayOffListFacade extends AbstractFacade<VacationsGraphDayOffListInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: VacationsGraphDayOffListState
  ) {
    super(geRx, store);
  }
}
