import { createResource } from '../services/api-resource/utils';
import { UserSettingsInterface } from '../models/menu-condition.interface';
import { Environment } from '../classes/ennvironment/environment';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TTL_30_MINUTES } from '../services/api-resource/constants';
import { getCurrentEmployeeId } from '../services/session.service';

export const UserSectionSettingsResource = createResource(
  () => 'user-section-settings-' + getCurrentEmployeeId(),
  () => {
    const http = inject(HttpClient);
    return http.get<UserSettingsInterface>(
      `${Environment.inv().api}/wa_users/sectionsSettings`,
    );
  },
  {
    cache: {
      ttl: TTL_30_MINUTES,
    },
  },
);
