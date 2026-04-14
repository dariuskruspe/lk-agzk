import { inject } from '@angular/core';
import { createResource as createApiResource } from '../services/api-resource/utils';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IssuesTypesInterface } from '@features/issues/models/issues-types.interface';
import { Environment } from '@app/shared/classes/ennvironment/environment';
import { firstValueFrom } from 'rxjs';
import { TTL_1_DAY, TTL_30_MINUTES } from '../services/api-resource/constants';

export const IssueTypesResource = createApiResource(
  'issue-types',
  async (filterData?: any) => {
    const http = inject(HttpClient);
    let httpParams = new HttpParams();
    if (filterData) {
      for (const key of Object.keys(filterData)) {
        if (
          Array.isArray(filterData[key])
            ? filterData[key].length
            : filterData[key]
        ) {
          httpParams = httpParams.append(key, filterData[key]);
        }
      }
    }

    return firstValueFrom(
      http.get<IssuesTypesInterface>(`${Environment.inv().api}/wa_issueTypes`, {
        params: httpParams,
      }), 
    );
  },
  {
    cache: { ttl: TTL_1_DAY, remoteKey: 'issueTypes' },
  },
);
