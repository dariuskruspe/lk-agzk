import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Environment } from '@app/shared/classes/ennvironment/environment';
import { VacationsInterface, VacationsRequestMembersInterface } from '@app/features/vacations/models/vacations.interface';
import { VacationsGraphMembersInterface } from '@app/features/vacations/models/vacations-graph-members.interface';
import { VacationActionEnum, VacationsApprovalInterface } from '@app/features/vacations/models/vacations-approval.interface';
import { MemberPointTypeInterface } from './types';
import { VacationsStatesInterface } from '@app/features/vacations/models/vacations-states.interface';
import { injectResource } from '@app/shared/services/api-resource/utils';
import { VacationTypesResource } from '@app/shared/api-resources/vacation-types.resource';
import { ScheduleListResource } from '@app/shared/api-resources/schedule-list.resource';
import { DayOffListResource } from '@app/shared/api-resources/day-off-list.resource';
import { EmployeePersonalDataInterface } from '@app/features/employees/models/employees-personal-data.interface';

@Injectable({
  providedIn: 'root',
})
export class VacationsApiService {
  private http = inject(HttpClient);

  private vacationTypesResource = injectResource(VacationTypesResource);
  private scheduleListResource = injectResource(ScheduleListResource);
  private dayOffListResource = injectResource(DayOffListResource);

  getVacationPeriods(options: {
    year: number;
    subordinates: boolean;
    sectionId: 'vacationSchedule' | 'employeesVacations';
  }) {
    return this.http.get<VacationsInterface[]>(
      `${Environment.inv().api}/vacationSchedule/vacations`,
      {
        params: options,
      },
    );
  }

  getMembers(sectionId: 'vacationSchedule' | 'employeesVacations') {
    return this.http
      .get<VacationsRequestMembersInterface>(
        `${Environment.inv().api}/vacationSchedule/members`,
        { params: { sectionId } },
      )
      .pipe(map((result) => result.members));
  }

  getStatusTypes() {
    return this.http.get<MemberPointTypeInterface[]>(
      `${Environment.inv().api}/members/pointTypes`,
    );
  }

  getVacationStates() {
    return this.http.get<VacationsStatesInterface>(
      `${Environment.inv().api}/vacationSchedule/states`,
    );
  }

  getVacationTypes() {
    return this.vacationTypesResource.asObservable();
  }

  getDayOffList(options: { startDate: Date; stopDate: Date }) {
    return this.dayOffListResource.asObservable({
      startDate: options.startDate.toISOString(),
      stopDate: options.stopDate.toISOString(),
    });
  }

  getEmployeeProfile(employeeId: string) {
    return this.http.get<EmployeePersonalDataInterface>(
      `${Environment.inv().api}/wa_company/employeeProfile/${employeeId}`,
    );
  }

  approveOrDiscardVacations(
    action: VacationActionEnum,
    year: number,
    employees: VacationsApprovalInterface[],
  ) {
    return this.http.patch<void>(
      `${Environment.inv().api}/vacationSchedule/${action}`,
      { employees },
      { params: { year } },
    );
  }
}
