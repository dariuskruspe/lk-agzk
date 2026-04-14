import { createResource } from '@app/shared/services/api-resource/utils';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TTL_1_YEAR } from '@app/shared/services/api-resource/constants';

export const DockyWritingAnimationResource = createResource(
  'docky-writing-animation',
  async () => {
    const http = inject(HttpClient);
    const data = await firstValueFrom(
      http.get<any>('assets/animations/docky-writing/data.json'),
    );

    return data;
  },
  { cache: { ttl: TTL_1_YEAR, forced: true } },
);

export const DockyRunningAnimationResource = createResource(
  'docky-running-animation',
  async () => {
    const http = inject(HttpClient);
    const data = await firstValueFrom(
      http.get<any>('assets/animations/docky-running/data.json'),
    );

    return data;
  },
  { cache: { ttl: TTL_1_YEAR, forced: true } },
);
