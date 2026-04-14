import { createResource } from '../services/api-resource/utils';
import { Environment } from '../classes/ennvironment/environment';
import { UserDataInterface } from '@app/features/users/models/user-personal-data.interface';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TTL_1_HOUR, TTL_1_MINUTE } from '../services/api-resource/constants';

type StaticDataResourceParams = {
  employeeId: string;
};

export const StaticDataResource = createResource(
  (employeeId: string) => `static-data-${employeeId}`,
  (employeeId: string) => {
    const http = inject(HttpClient);
    return http.get<UserDataInterface>(
      `${Environment.inv().api}/wa_employee/${employeeId}/staticData`,
    );
  },
  {
    cache: {
      ttl: TTL_1_HOUR,
    },
  },
);
