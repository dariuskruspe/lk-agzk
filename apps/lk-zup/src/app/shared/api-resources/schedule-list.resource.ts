import { createResource } from '../services/api-resource/utils';
import { Environment } from '../classes/ennvironment/environment';
import { VacationsGraphDayOffListInterface } from '@app/features/vacations/models/vacations-graph-day-off-list.interface';
import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TTL_1_HOUR, TTL_10_MINUTES } from '../services/api-resource/constants';

type ScheduleListResourceParams = {
  dateBegin: string;
  dateEnd: string;
};

export const ScheduleListResource = createResource(
  (param) => `schedule-list-${param.dateBegin}-${param.dateEnd}`,
  (param: ScheduleListResourceParams) => {
    const http = inject(HttpClient);
    let httpParams = new HttpParams();
    for (const key of Object.keys(param)) {
      httpParams = httpParams.append(key, param[key]);
    }
    return http.get<VacationsGraphDayOffListInterface>(
      `${Environment.inv().api}/members/sheduleList`,
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
