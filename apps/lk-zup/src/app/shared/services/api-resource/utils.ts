import { inject } from '@angular/core';
import { ApiResourceService } from './api-resource.service';
import { CachedEntity, CachedEntityOptions } from './types';
import { Observable } from 'rxjs';

export const createResource = <TArgs extends unknown[], TResult>(
  key: string | ((...args: TArgs) => string),
  fn: (...args: TArgs) => Promise<TResult> | Observable<TResult>,
  options: CachedEntityOptions = { cache: null },
): CachedEntity<TArgs, TResult> => {
  return {
    key,
    options,
    fn,
  };
};

export const injectResource = <TArgs extends unknown[], TResult>(
  entity: CachedEntity<TArgs, TResult>,
) => {
  const entityService = inject(ApiResourceService);
  return entityService.inject(entity);
};

export type $inferResourceResult<T> = T extends (...args: unknown[]) => infer R
  ? R
  : never;
