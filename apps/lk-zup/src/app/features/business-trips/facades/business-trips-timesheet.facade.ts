import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { VacationsInterface } from '../../vacations/models/vacations.interface';
import { BusinessTripsTimesheetState } from '../states/business-trips-timesheet.state';

@Injectable({
  providedIn: 'root',
})
export class BusinessTripsTimesheetFacade extends AbstractFacade<
  VacationsInterface[]
> {
  constructor(
    protected geRx: GeRx,
    protected store: BusinessTripsTimesheetState
  ) {
    super(geRx, store);
  }

  getTimesheet(filterData: {
    dateBegin: string;
    dateEnd: string;
    sectionId: string;
  }): void {
    this.geRx.show(this.store.entityName, filterData);
  }
}
