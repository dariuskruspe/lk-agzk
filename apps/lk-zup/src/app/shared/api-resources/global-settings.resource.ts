import { createResource } from '../services/api-resource/utils';
import { Environment } from '../classes/ennvironment/environment';
import { inject } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import {
  TTL_1_MINUTE,
  TTL_30_MINUTES,
} from '../services/api-resource/constants';
import { SettingsInterface } from '../features/settings/models/settings.interface';

export const GlobalSettingsResource = createResource(
  'global-settings',
  () => {
    const http = new HttpClient(inject(HttpBackend));
    return http.get<SettingsInterface>(
      `${Environment.inv().apiRoot}/wa_global/settings`,
    );
  },
  {
    cache: {
      ttl: TTL_1_MINUTE,
    },
  },
);
