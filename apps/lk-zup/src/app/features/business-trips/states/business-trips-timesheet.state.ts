import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { BusinessTripsTimesheetService } from '../services/business-trips-timesheet.service';

@Injectable({
  providedIn: 'root',
})
export class BusinessTripsTimesheetState {
  public entityName = 'businessTripTimesheet';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.timesheetService.getTrips.bind(this.timesheetService),
    },
  };

  constructor(private timesheetService: BusinessTripsTimesheetService) {}
}
