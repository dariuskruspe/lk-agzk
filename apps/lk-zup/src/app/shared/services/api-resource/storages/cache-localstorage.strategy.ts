import { type CacheItem, CacheStorage } from '../types';

export class CacheLocalStorageStrategy implements CacheStorage {
  constructor(private readonly storage: Storage) {}

  private isExpired(item: CacheItem<any>): boolean {
    if (!item.ttl) return false;
    return Date.now() - item.createdAt > item.ttl;
  }

  async get<T>(key: string): Promise<CacheItem<T> | null> {
    const value = this.storage.getItem(key);
    if (!value) return null;

    try {
      const item: CacheItem<T> = JSON.parse(value);

      if (this.isExpired(item)) {
        // Удаляем просроченный элемент
        this.storage.removeItem(key);
        return null;
      }

      return item;
    } catch {
      // Если не удалось распарсить как CacheItem, удаляем запись
      this.storage.removeItem(key);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const item: CacheItem<T> = {
      value,
      ttl,
      createdAt: Date.now(),
    };

    this.storage.setItem(key, JSON.stringify(item));
  }

  async remove(key: string): Promise<void> {
    this.storage.removeItem(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }

  async has(key: string): Promise<boolean> {
    const value = this.storage.getItem(key);
    if (!value) return false;

    try {
      const item: CacheItem<any> = JSON.parse(value);

      if (this.isExpired(item)) {
        // Удаляем просроченный элемент
        this.storage.removeItem(key);
        return false;
      }

      return true;
    } catch {
      // Если не удалось распарсить как CacheItem, удаляем запись
      this.storage.removeItem(key);
      return false;
    }
  }
}
