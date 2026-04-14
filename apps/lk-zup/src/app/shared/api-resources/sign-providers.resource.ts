import { createResource } from '../services/api-resource';

import { Environment } from '../classes/ennvironment/environment';
import { ProvidersInterface } from '@app/shared/features/signature-validation-form/models/providers.interface';
import { TTL_30_MINUTES } from '@app/shared/services/api-resource/constants';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

export const SignProvidersResource = createResource(
  'sign-providers',
  () => {
    const http = inject(HttpClient);
    return http.get<ProvidersInterface>(
      `${Environment.inv().api}/wa_global/signProviders`,
    );
  },
  {
    cache: { ttl: TTL_30_MINUTES },
  },
);
