import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Environment } from '@shared/classes/ennvironment/environment';
import {
  GetTimesheetScheduleParams,
  TimesheetScheduleResponse,
} from '../models/timesheet-schedule.interface';
import { Observable } from 'rxjs';
import { toPromise } from '../../../utilits/to-promise';

@Injectable({
  providedIn: 'root',
})
export class TimesheetApiService {
  private http = inject(HttpClient);

  getSchedule(
    employeeId: string,
    params?: GetTimesheetScheduleParams,
    abortSignal?: AbortSignal,
  ): Promise<TimesheetScheduleResponse> {
    let httpParams = new HttpParams();
    if (params?.startDate != null) {
      httpParams = httpParams.append(
        'startDate',
        typeof params.startDate === 'string'
          ? params.startDate
          : params.startDate.toISOString(),
      );
    }
    if (params?.endDate != null) {
      httpParams = httpParams.append(
        'endDate',
        typeof params.endDate === 'string'
          ? params.endDate
          : params.endDate.toISOString(),
      );
    }
    if (params?.mode) {
      httpParams = httpParams.append('mode', params.mode);
    }

    return toPromise(
      this.http.get<TimesheetScheduleResponse>(
        `${Environment.inv().api}/wa_employee/${employeeId}/schedule`,
        { params: httpParams },
      ),
      abortSignal,
    );
  }
}
