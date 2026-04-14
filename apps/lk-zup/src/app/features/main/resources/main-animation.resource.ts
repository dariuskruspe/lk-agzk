import { createResource } from '@app/shared/services/api-resource/utils';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TTL_1_YEAR } from '@app/shared/services/api-resource/constants';

export const MainAnimationResource = createResource(
  'main-animation',
  async () => {
    const http = inject(HttpClient);
    const data = await firstValueFrom(
      http.get<any>('assets/animations/init.json'),
    );

    return data;
  },
  { cache: { ttl: TTL_1_YEAR, forced: true } },
);
