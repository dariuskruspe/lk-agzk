import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import {
  VacationPeriodInterface,
  VacationsInterface,
} from '../../vacations/models/vacations.interface';
import { BusinessTripsTimesheetListItem } from '../constants/business-trip-data-config';

@Injectable({
  providedIn: 'root',
})
export class BusinessTripsTimesheetService {
  constructor(private http: HttpClient) {}

  getTrips(filterData: {
    dateBegin: string;
    dateEnd: string;
    sectionId: string;
  }): Observable<VacationsInterface[]> {
    return this.http
      .get<BusinessTripsTimesheetListItem[]>(
        `${Environment.inv().api}/timesheet/data`,
        {
          params: {
            dateBegin: filterData.dateBegin,
            dateEnd: filterData.dateEnd,
            sectionId: filterData.sectionId,
          },
        }
      )
      .pipe(
        map((value) =>
          value.map((trip) => {
            const periods: VacationPeriodInterface[] = trip.periods.map(
              (period) => {
                return {
                  startDate: period.startDate,
                  endDate: period.endDate,
                  daysLength: +period.daysLength,
                  approved: null,
                  typeId: period.typeId,
                  stateId: '',
                  lastComment: null,
                  activeApprovement: false,
                  vacationTypeId: '',
                  vacationDocument: '',
                  leaveRequest: { id: '', name: '' },
                  vacationRescheduled: false,
                  vacationConfirmationAvailable: false,
                  vacationReshedulingAvailable: false,
                  issueId: period.issueId,
                  vacationReshedulingAlias: '',
                  status: period.status,
                  documentId: period.documentId,
                  linkedIssueId: period.linkedIssueId,
                  linkedIssueTypeId: period.linkedIssueTypeId,
                  cancelAccess: period.cancelAccess,
                };
              }
            );
            return { ...trip, periods };
          })
        )
      );
  }
}
