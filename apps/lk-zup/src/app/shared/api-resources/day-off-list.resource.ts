import { createResource } from '../services/api-resource/utils';
import { Environment } from '../classes/ennvironment/environment';
import { VacationsGraphDayOffListInterface } from '@app/features/vacations/models/vacations-graph-day-off-list.interface';
import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LocalStorageService } from '../services/local-storage.service';
import { TTL_1_HOUR, TTL_1_MINUTE } from '../services/api-resource/constants';

type DayOffListResourceParams = {
  startDate: string;
  stopDate: string;
};

export const DayOffListResource = createResource(
  (param) => {
    const localStorageService = inject(LocalStorageService);
    const currentEmployeeId = localStorageService.getCurrentEmployeeId();
    return `day-off-list-${currentEmployeeId}-${param.startDate}-${param.stopDate}`;
  },
  (param: DayOffListResourceParams) => {
    const http = inject(HttpClient);
    const localStorageService = inject(LocalStorageService);
    const currentEmployeeId = localStorageService.getCurrentEmployeeId();
    let httpParams = new HttpParams();
    for (const key of Object.keys(param)) {
      httpParams = httpParams.append(key, param[key]);
    }
    return http.get<VacationsGraphDayOffListInterface>(
      `${Environment.inv().api}/members/${currentEmployeeId}/daysOffList`,
      {
        params: httpParams,
      },
    );
  },
  {
    cache: {
      ttl: TTL_1_HOUR, // TODO: подумать над ttl
    },
  },
);
