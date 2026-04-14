import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Environment } from '@app/shared/classes/ennvironment/environment';
import {
  VacationsInterface,
  VacationPeriodInterface,
} from '@app/features/vacations/models/vacations.interface';
import { MemberPointTypeInterface } from '@app/features/vacations_v2/shared/types';
import {
  BusinessTripsTimesheetListItem,
  BusinessTripsMemberListItem,
} from '@app/features/business-trips/constants/business-trip-data-config';

@Injectable({
  providedIn: 'root',
})
export class BusinessTripApiService {
  private http = inject(HttpClient);

  getTrips(options: {
    dateBegin: string;
    dateEnd: string;
    sectionId: 'businessTrips' | 'employeeBusinessTrips';
  }) {
    return this.http
      .get<BusinessTripsTimesheetListItem[]>(
        `${Environment.inv().api}/timesheet/data`,
        { params: options },
      )
      .pipe(
        map((value) =>
          value.map((trip) => {
            const periods: VacationPeriodInterface[] = trip.periods.map(
              (period) => ({
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
              }),
            );
            return { ...trip, periods } as VacationsInterface;
          }),
        ),
      );
  }

  getMembers(sectionId: 'businessTrips' | 'employeeBusinessTrips') {
    return this.http
      .get<{ members: BusinessTripsMemberListItem[] }>(
        `${Environment.inv().api}/timesheet/members`,
        { params: { sectionId } },
      )
      .pipe(map((result) => result.members));
  }

  getStatusTypes() {
    return this.http.get<MemberPointTypeInterface[]>(
      `${Environment.inv().api}/members/pointTypes`,
    );
  }
}
