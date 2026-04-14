import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { VacationsGraphDayOffListInterface } from '../models/vacations-graph-day-off-list.interface';
import { VacationsScheduleListState } from '../states/vacations-schedule-list.state';

@Injectable({
  providedIn: 'root',
})
export class VacationsScheduleListFacade extends AbstractFacade<VacationsGraphDayOffListInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: VacationsScheduleListState
  ) {
    super(geRx, store);
  }
}
