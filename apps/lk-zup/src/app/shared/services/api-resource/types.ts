import { Observable } from 'rxjs';

export type CacheItem<T> = {
  value: T;
  ttl?: number;
  createdAt: number;
};

export interface CacheStorage {
  get<T>(key: string): Promise<CacheItem<T> | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
}

export interface CacheEntity<TArgs extends unknown[], TResult> {
  readonly ttl: number;

  fetch: (...args: TArgs) => Promise<TResult>;
}

export type CachedEntityOptions = {
  cache: { ttl: number; remoteKey?: string, forced?: boolean } | null;
};

export type CachedEntity<TArgs extends unknown[], TResult> = {
  key: string | ((...args: TArgs) => string);
  options: CachedEntityOptions;
  fn: (...args: TArgs) => Promise<TResult> | Observable<TResult>;
};
