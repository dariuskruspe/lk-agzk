import { UserStorageInterface } from '@shared/interfaces/storage/user/user-storage.interface';

/**
 * Интерфейс хранилища данных актуального состояния системы, связанных с пользователями.
 */
export interface UserGlobalStorageInterface {
  /**
   * Хранилище данных актуального состояния системы, связанных с конкретным пользователем.
   */
  // [userUUID: string]: UserStorageInterface;

  /**
   * Хранилище данных актуального состояния системы, связанных с текущим пользователем.
   */
  current?: UserStorageInterface;
}
