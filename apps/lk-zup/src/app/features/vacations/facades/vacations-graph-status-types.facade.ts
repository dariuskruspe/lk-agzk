import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { WorkStatusInterface } from '../../../shared/features/calendar-graph/models/calendar-graph-member-list.interface';
import { VacationsGraphStatusTypesState } from '../states/vacations-graph-status-types.state';

@Injectable({
  providedIn: 'root',
})
export class VacationsGraphStatusTypesFacade extends AbstractFacade<
  WorkStatusInterface[]
> {
  constructor(
    protected geRx: GeRx,
    protected store: VacationsGraphStatusTypesState
  ) {
    super(geRx, store);
  }
}
