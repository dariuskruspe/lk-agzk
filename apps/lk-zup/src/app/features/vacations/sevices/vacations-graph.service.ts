import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, WritableSignal, inject } from '@angular/core';
import { UrlSegment } from '@angular/router';
import { EmployeesService } from '@features/employees/services/employees.service';
import { PageStorageInterface } from '@shared/interfaces/storage/page/page-storage.interface';
import { AppService } from '@shared/services/app.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import {
  VacationActionEnum,
  VacationsApprovalInterface,
} from '../models/vacations-approval.interface';
import { VacationsGraphDayOffListInterface } from '../models/vacations-graph-day-off-list.interface';
import { VacationsGraphMembersInterface } from '../models/vacations-graph-members.interface';
import { VacationsStatesInterface } from '../models/vacations-states.interface';
import {
  VacationTypesInterface,
  VacationTypesResponseInterface,
} from '../models/vacations-types.interface';
import {
  AvailableDaysReponseInterface,
  VacationPeriodInterface,
  VacationsInterface,
  VacationsRequestMembersInterface,
} from '../models/vacations.interface';
import { injectResource } from '@app/shared/services/api-resource/utils';
import { VacationTypesResource } from '@app/shared/api-resources/vacation-types.resource';
import { ScheduleListResource } from '@app/shared/api-resources/schedule-list.resource';
import { DayOffListResource } from '@app/shared/api-resources/day-off-list.resource';

@Injectable({
  providedIn: 'root',
})
export class VacationsGraphService {
  app = inject(AppService);

  localStorageService = inject(LocalStorageService);

  employeeService = inject(EmployeesService);

  currentPageStorage: PageStorageInterface = this.app.storage.page.current;

  urlSegmentsSignal: WritableSignal<UrlSegment[]> =
    this.currentPageStorage.data.frontend.signal.urlSegments;

  vacationTypesResource = injectResource(VacationTypesResource);

  scheduleListResource = injectResource(ScheduleListResource);

  dayOffListResource = injectResource(DayOffListResource);

  constructor(
    private http: HttpClient,
    protected localStorage: LocalStorageService,
  ) {}

  private getMembers(): Observable<VacationsGraphMembersInterface[]> {
    // Является ли текущей страницей "Отпуска сотрудников"
    const isVacationsManagement =
      this.urlSegmentsSignal()?.[0]?.path === 'vacations-management';
    let httpParams = new HttpParams();
    httpParams = httpParams.append(
      'sectionId',
      isVacationsManagement ? 'employeesVacations' : 'vacationSchedule',
    );
    return this.http
      .get<VacationsRequestMembersInterface>(
        `${Environment.inv().api}/vacationSchedule/members`,
        { params: httpParams },
      )
      .pipe(map((result) => result.members));
  }

  getStatusTypes(): Observable<unknown[]> {
    return this.http.get<unknown[]>(
      `${Environment.inv().api}/members/pointTypes`,
    );
  }

  getVacationStates(): Observable<VacationsStatesInterface> {
    return this.http.get<VacationsStatesInterface>(
      `${Environment.inv().api}/vacationSchedule/states`,
    );
  }

  getVacationTypes(): Observable<VacationTypesInterface> {
    return this.vacationTypesResource.asObservable();
  }

  getDayOffList(param: {
    startDate: string;
    stopDate: string;
  }): Observable<VacationsGraphDayOffListInterface> {
    return this.dayOffListResource.asObservable(param);
  }

  getScheduleList(param: {
    dateBegin: string;
    dateEnd: string;
  }): Observable<VacationsGraphDayOffListInterface> {
    return this.scheduleListResource.asObservable(param);
  }

  getDepartments(
    sectionId?: 'vacationSchedule' | 'employeesVacations',
  ): Observable<{ departments: { id: string; name: string }[] }> {
    const isVacationsManagement =
      this.urlSegmentsSignal()?.[0]?.path === 'vacations-management';
    const finalSectionId =
      sectionId ||
      (isVacationsManagement ? 'employeesVacations' : 'vacationSchedule');

    let httpParams = new HttpParams();
    httpParams = httpParams.append('sectionId', finalSectionId);

    return this.http.get<{ departments: { id: string; name: string }[] }>(
      `${Environment.inv().api}/vacationSchedule/departments`,
      { params: httpParams },
    );
  }

  getVacationPeriods(param: {
    year: number;
  }): Observable<VacationsInterface[]> {
    // Является ли текущей страницей "Отпуска сотрудников"
    const isVacationsManagement =
      this.urlSegmentsSignal()?.[0]?.path === 'vacations-management';

    let httpParams = new HttpParams();
    for (const key of Object.keys(param)) {
      httpParams = httpParams.append(key, param[key]);
    }
    httpParams = httpParams.append('subordinates', isVacationsManagement);
    httpParams = httpParams.append(
      'sectionId',
      isVacationsManagement ? 'employeesVacations' : 'vacationSchedule',
    );

    return forkJoin({
      members: this.getMembers(),
      vacations: this.http.get<VacationsInterface[]>(
        `${Environment.inv().api}/vacationSchedule/vacations`,
        { params: httpParams },
      ),
    }).pipe(
      map((data) => {
        const { members } = data;
        let { vacations } = data;

        if (isVacationsManagement) {
          // оставляем отпуска только тех сотрудников, которые находятся в подчинении у текущего пользователя
          vacations = vacations.filter((v) => {
            return members.some((s) => s.id === v.employeeId && s.subordinate);
          });
        }

        return vacations.map((vacation) => ({
          ...vacation,
          subordinated:
            members.find((member) => member.id === vacation.employeeId)
              ?.subordinate ?? false,
          approvingAllowed:
            members.find((member) => member.id === vacation.employeeId)
              ?.approvingAllowed ?? false,
        }));
      }),
    );
  }

  savePeriods(
    periods: VacationPeriodInterface[],
    param: {
      year: number;
    },
  ): Observable<void> {
    let httpParams = new HttpParams();
    for (const key of Object.keys(param)) {
      httpParams = httpParams.append(key, param[key]);
    }
    return this.http.post<void>(
      `${Environment.inv().api}/vacationSchedule/vacations`,
      {
        periods,
      },
      {
        params: httpParams,
      },
    );
  }

  getAvailableVacationDays(param: {
    year: number;
  }): Observable<AvailableDaysReponseInterface> {
    let httpParams = new HttpParams();
    for (const key of Object.keys(param)) {
      httpParams = httpParams.append(key, param[key]);
    }
    return this.http.get<AvailableDaysReponseInterface>(
      `${Environment.inv().api}/vacationSchedule/availableVacationDays`,
      {
        params: httpParams,
      },
    );
  }

  approveOrDiscardVacations(
    action: VacationActionEnum,
    param: {
      year: number;
    },
    employees: VacationsApprovalInterface[],
  ): Observable<void> {
    let httpParams = new HttpParams();
    for (const key of Object.keys(param)) {
      httpParams = httpParams.append(key, param[key]);
    }
    return this.http.patch<void>(
      `${Environment.inv().api}/vacationSchedule/${action}`,
      {
        employees,
      },
      {
        params: httpParams,
      },
    );
  }
}
