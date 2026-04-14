import { HttpClient } from '@angular/common/http';
import { Environment } from '../classes/ennvironment/environment';
import { createResource } from '../services/api-resource/utils';
import { inject } from '@angular/core';
import { DocumentStatesInterface } from '@app/features/agreements/models/document-states.interface';
import {
  TTL_10_MINUTES,
  TTL_30_MINUTES,
} from '../services/api-resource/constants';

export const DocumentStatesResource = createResource(
  'document-states',
  () => {
    const http = inject(HttpClient);
    return http.get<DocumentStatesInterface>(
      `${Environment.inv().api}/wa_global/documentsStates`,
    );
  },
  {
    cache: { ttl: TTL_30_MINUTES }, // todo: подкорректировать ttl
  },
);
