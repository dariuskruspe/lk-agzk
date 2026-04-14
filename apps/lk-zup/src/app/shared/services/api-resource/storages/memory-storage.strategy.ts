import { CacheStorage } from '../types';

interface CacheItem<T> {
  value: T;
  ttl?: number;
  createdAt: number;
}

export class MemoryStorageStrategy implements CacheStorage {
  private readonly store = new Map<string, CacheItem<any>>();
  private cleanupTimer?: number;

  constructor(private readonly cleanupInterval: number = 60000) {
    // 1 минута по умолчанию
    // Запускаем периодическую очистку просроченных записей
    this.startCleanupTimer();
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = window.setInterval(() => {
      this.cleanupExpired();
    }, this.cleanupInterval);
  }

  private cleanupExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.store.entries()) {
      if (this.isExpired(item, now)) {
        this.store.delete(key);
      }
    }
  }

  private isExpired(item: CacheItem<any>, currentTime?: number): boolean {
    if (!item.ttl) return false;
    const now = currentTime ?? Date.now();
    return now - item.createdAt > item.ttl;
  }

  async get<T>(key: string): Promise<CacheItem<T> | null> {
    const item = this.store.get(key) as CacheItem<T> | undefined;

    if (!item) {
      return null;
    }

    if (this.isExpired(item)) {
      this.store.delete(key);
      return null;
    }

    return item;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const item: CacheItem<T> = {
      value,
      ttl,
      createdAt: Date.now(),
    };

    this.store.set(key, item);
  }

  async remove(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }

  async has(key: string): Promise<boolean> {
    const item = this.store.get(key);

    if (!item) {
      return false;
    }

    if (this.isExpired(item)) {
      this.store.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Получить количество записей в кеше
   */
  get size(): number {
    return this.store.size;
  }

  /**
   * Получить все ключи в кеше (только не просроченные)
   */
  async keys(): Promise<string[]> {
    const validKeys: string[] = [];
    const now = Date.now();

    for (const [key, item] of this.store.entries()) {
      if (!this.isExpired(item, now)) {
        validKeys.push(key);
      } else {
        this.store.delete(key);
      }
    }

    return validKeys;
  }

  /**
   * Принудительная очистка просроченных записей
   */
  async cleanup(): Promise<number> {
    const initialSize = this.store.size;
    this.cleanupExpired();
    return initialSize - this.store.size;
  }

  /**
   * Остановить автоматическую очистку (для освобождения ресурсов)
   */
  destroy(): void {
    if (this.cleanupTimer !== undefined) {
      window.clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
    this.store.clear();
  }
}
