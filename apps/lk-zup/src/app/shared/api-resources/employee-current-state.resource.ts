import { createResource } from '../services/api-resource';
import { Environment } from '../classes/ennvironment/environment';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TTL_30_MINUTES } from '../services/api-resource/constants';

export const EmployeeCurrentStateResource = createResource(
  (employeeID: string) => `employee-current-state-${employeeID}`,
  (employeeID: string) => {
    const http = inject(HttpClient);
    return http.get<{
      dateBegin: string;
      dateEnd: string;
      employeeID: string | number;
      status: number;
    }>(`${Environment.inv().api}/wa_employee/${employeeID}/currentState`);
  },
  {
    cache: {
      ttl: TTL_30_MINUTES,
    },
  },
);
