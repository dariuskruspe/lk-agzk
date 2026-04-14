import { createResource } from '../../../services/api-resource';
import { Environment } from '../../../classes/ennvironment/environment';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TTL_1_HOUR } from '../../../services/api-resource/constants';

export const MessageLangResource = createResource(
  'message-lang',
  () => {
    const http = inject(HttpClient);
    return http.get<{ language: string }>(
      `${Environment.inv().api}/wa_users/messageLanguage`,
    );
  },
  {
    cache: {
      ttl: TTL_1_HOUR,
    },
  },
);
