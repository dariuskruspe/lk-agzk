import { createResource } from '../services/api-resource/utils';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { TTL_30_MINUTES } from '../services/api-resource/constants';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { Environment } from '@app/shared/classes/ennvironment/environment';
import { IssuesStatusInterface } from '@app/features/issues/models/issues.interface';

export const IssueStateListResource = createResource(
  'issue-state-list',
  () => {
    const http = inject(HttpClient);
    return http
      .get<IssuesStatusInterface>(`${Environment.inv().api}/wa_issues/states`)
      .pipe(
        map((data) => {
          return {
            states: data.states.map((state) => ({
              ...state,
              color: state.color.startsWith('#')
                ? state.color
                : `var(--${state.color})`,
            })),
          } as IssuesStatusInterface;
        }),
      );
  },
  {
    cache: {
      ttl: TTL_30_MINUTES, // todo: подумать над ttl
    },
  },
);
