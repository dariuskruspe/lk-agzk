import { type CacheItem, CacheStorage } from '../types';

export class IndexedDbStorageStrategy implements CacheStorage {
  private readonly dbName = 'api-entities-cache';
  private readonly storeName = 'cache-store';
  private readonly dbVersion = 1;
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void>;

  constructor() {
    this.initPromise = this.initDatabase();
  }

  private async initDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  private async ensureDatabase(): Promise<IDBDatabase> {
    await this.initPromise;
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  private isExpired(item: CacheItem<any>): boolean {
    if (!item.ttl) return false;
    return Date.now() - item.createdAt > item.ttl;
  }

  async get<T>(key: string): Promise<CacheItem<T> | null> {
    const db = await this.ensureDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onerror = () => {
        reject(new Error('Failed to get item from IndexedDB'));
      };

      request.onsuccess = () => {
        const item: CacheItem<T> | undefined = request.result;

        if (!item) {
          resolve(null);
          return;
        }

        if (this.isExpired(item)) {
          // Удаляем просроченный элемент асинхронно
          this.remove(key).catch(console.error);
          resolve(null);
          return;
        }

        resolve(item);
      };
    });
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const db = await this.ensureDatabase();

    const item: CacheItem<T> = {
      value,
      ttl,
      createdAt: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(item, key);

      request.onerror = () => {
        reject(new Error('Failed to set item in IndexedDB'));
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  async remove(key: string): Promise<void> {
    const db = await this.ensureDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onerror = () => {
        reject(new Error('Failed to remove item from IndexedDB'));
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  async clear(): Promise<void> {
    const db = await this.ensureDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onerror = () => {
        reject(new Error('Failed to clear IndexedDB store'));
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  async has(key: string): Promise<boolean> {
    const db = await this.ensureDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onerror = () => {
        reject(new Error('Failed to check item in IndexedDB'));
      };

      request.onsuccess = () => {
        const item: CacheItem<any> | undefined = request.result;

        if (!item) {
          resolve(false);
          return;
        }

        if (this.isExpired(item)) {
          // Удаляем просроченный элемент асинхронно
          this.remove(key).catch(console.error);
          resolve(false);
          return;
        }

        resolve(true);
      };
    });
  }
}
