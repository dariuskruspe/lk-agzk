import { createResource } from '../services/api-resource/utils';
import { UserSettingsInterface } from '../models/menu-condition.interface';
import { Environment } from '../classes/ennvironment/environment';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TTL_30_MINUTES } from '../services/api-resource/constants';
import { MainCurrentUserInterface } from '@features/main/models/main-current-user.interface';
import { getSessionId } from '../services/session.service';

export const UserCurrentResource = createResource(
  () => 'user-current-' + getSessionId(),
  () => {
    const http = inject(HttpClient);
    return http.get<MainCurrentUserInterface>(
      `${Environment.inv().api}/wa_users/current`,
    );
  },
  {
    cache: {
      ttl: TTL_30_MINUTES,
    },
  },
);
