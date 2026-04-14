import { createResource } from '../../../shared/services/api-resource';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TTL_1_DAY } from '../../../shared/services/api-resource/constants';
import { EmployeeStateListInterface } from '../models/employees.interface';

export const EmployeesStateListResource = createResource(
  'employees-state-list',
  () => {
    const http = inject(HttpClient);
    return http.get<EmployeeStateListInterface>(
      `${Environment.inv().api}/wa_employee/employeesstateslist`,
    );
  },
  {
    cache: {
      ttl: TTL_1_DAY,
    },
  },
);
