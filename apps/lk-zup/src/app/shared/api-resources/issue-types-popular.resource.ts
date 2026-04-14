import { createResource } from '../services/api-resource/utils';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { TTL_1_DAY, TTL_30_MINUTES } from '../services/api-resource/constants';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { Environment } from '@app/shared/classes/ennvironment/environment';
import { IssuesStatusInterface } from '@app/features/issues/models/issues.interface';
import { DashboardPopular } from '@app/features/dashboard/models/dashboard-payslip.interface';

export const IssueTypesPopularResource = createResource(
  'issue-types-popular',
  () => {
    const http = inject(HttpClient);
    return http.get<DashboardPopular>(
      `${Environment.inv().api}/wa_issueTypes/popular`,
    );
  },
  {
    cache: {
      ttl: TTL_1_DAY, // todo: подумать над ttl
    },
  },
);
