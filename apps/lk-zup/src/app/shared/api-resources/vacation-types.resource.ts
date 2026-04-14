import { createResource } from '../services/api-resource/utils';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../classes/ennvironment/environment';
import { map } from 'rxjs/operators';
import { VacationTypesResponseInterface } from '@app/features/vacations/models/vacations-types.interface';
import { TTL_30_MINUTES } from '@app/shared/services/api-resource/constants';

export const VacationTypesResource = createResource(
  'vacation-types',
  () => {
    const http = inject(HttpClient);
    return http
      .get<VacationTypesResponseInterface>(
        `${Environment.inv().api}/vacationTypes`,
      )
      .pipe(
        map((types) => ({
          vacationTypes: types.vacationTypes.map((item) => ({
            ...item,
            vacationTypeId: item.vacationTypeID,
          })),
        })),
      );
  },
  {
    cache: {
      ttl: TTL_30_MINUTES,
    },
  },
);
