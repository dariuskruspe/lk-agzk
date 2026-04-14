import {
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { CachedEntity, CacheItem, CacheStorage } from './types';
import { IndexedDbStorageStrategy } from './storages/indexed-db-storage.strategy';
import { CacheLocalStorageStrategy } from './storages/cache-localstorage.strategy';
import { toSignal } from '@angular/core/rxjs-interop';
import { from, isObservable, firstValueFrom, Observable } from 'rxjs';
import { SessionService } from '../session.service';
import moment from 'moment';

type CacheContext = {
  injector: Injector;
  storage: CacheStorage;
};

@Injectable({
  providedIn: 'root',
})
export class ApiResourceService {
  private injector = inject(Injector);
  private sessionService = inject(SessionService);

  private storage = indexedDB
    ? new IndexedDbStorageStrategy()
    : new CacheLocalStorageStrategy(localStorage);

  private pendingEntity = new Map<string, Promise<unknown>>();

  private cacheEnabled = false;

  inject = <TArgs extends unknown[], TResult>(
    entity: CachedEntity<TArgs, TResult>,
  ) => {
    const { runLockedEntity, storage, injector } = this;

    const getKey = (...args: TArgs) =>
      runInInjectionContext(injector, () => {
        return typeof entity.key === 'function'
          ? entity.key(...args)
          : entity.key;
      });

    const res = async (...args: TArgs) => {
      const key = getKey(...args);

      return runLockedEntity(key, async () => {
        if (
          (this.cacheEnabled || entity.options.cache?.forced) &&
          entity.options.cache &&
          (await storage.has(key))
        ) {
          const item = await storage.get(key);

          if (
            entity.options.cache?.remoteKey &&
            this.isRemoteExpired(item, entity)
          ) {
            console.info(
              'Кеширование: Результат из кеша "' + key + '" устарел',
              'remoteKey',
              entity.options.cache.remoteKey,
            );
            storage.remove(key);
          } else {
            console.info(
              'Кеширование: Результат из кеша "' + key + '"',
              'ttl',
              entity.options.cache?.ttl,
            );
            return item.value as Promise<TResult>;
          }
        }

        const result = runInInjectionContext(injector, () =>
          entity.fn(...args),
        );

        let resultPromise: Promise<TResult>;

        if (isObservable(result)) {
          resultPromise = firstValueFrom(result) as Promise<TResult>;
        } else {
          resultPromise = result as Promise<TResult>;
        }

        const data = await resultPromise;
        if (entity.options.cache) {
          await storage.set(key, data, entity.options.cache.ttl);
        }
        return data;
      });
    };

    res.invalidateCache = (...args: TArgs) => {
      const key = getKey(...args);
      storage.remove(key);
    };

    res.fetch = async (...args: TArgs): Promise<TResult> => {
      const key = getKey(...args);

      storage.remove(key);
      return res(...args);
    };

    res.asObservable = (...args: TArgs): Observable<TResult> => {
      return from(res(...args));
    };

    res.asSignal = (args?: TArgs) => {
      const data = signal<TResult>(undefined);
      const loading = signal(false);
      const error = signal<Error | null>(null);

      const fetch = async (...args: TArgs) => {
        loading.set(true);
        try {
          const result = await res(...args);

          data.set(result);
        } catch (e) {
          error.set(e as Error);
          console.log('error', e);
        } finally {
          loading.set(false);
        }
      };

      if (args) {
        fetch(...args);
      }

      return {
        data,
        loading,
        error,
        fetch,
      };
    };

    return res;
  };

  private runLockedEntity = async (key: string, fn: () => Promise<any>) => {
    if (this.pendingEntity.has(key)) {
      return this.pendingEntity.get(key) as Promise<unknown>;
    }

    try {
      const promise = fn();
      this.pendingEntity.set(key, promise);
      return await promise;
    } finally {
      this.pendingEntity.delete(key);
    }
  };

  enableCache() {
    this.cacheEnabled = true;
  }

  resetCache() {
    this.storage.clear();
  }

  // проверяем, устарел ли кеш на бекенде
  private isRemoteExpired(
    cacheItem: CacheItem<any>,
    entity: CachedEntity<any, any>,
  ) {
    console.log('isRemoteExpired', entity.options.cache?.remoteKey, entity);
    if (!entity.options.cache?.remoteKey) {
      return false;
    }

    const remoteCacheChangedTime = this.getRemoteCacheChangedTime(
      entity.options.cache.remoteKey,
    );

    if (!remoteCacheChangedTime) {
      return false;
    }

    // если дата создания кеша меньше даты изменения remote кеша, то кеш устарел
    return cacheItem.createdAt < remoteCacheChangedTime;
  }

  private getRemoteCacheChangedTime(key: string) {
    const value = this.sessionService.cacheChangedTime();
    console.log('getRemoteCacheChangedTime', value, key);
    if (value && value[key]) {
      return moment(value[key]).valueOf();
    }
    return null;
  }
}
