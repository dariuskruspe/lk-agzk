import { PageGlobalStorageInterface } from '@shared/interfaces/storage/page/page-global-storage.interface';
import { ScreenStorageInterface } from '@shared/interfaces/storage/screen/screen-storage.interface';
import { SettingsStorageInterface } from '@shared/interfaces/storage/settings/settings-storage.interface';
import { UserGlobalStorageInterface } from '@shared/interfaces/storage/user/user-global-storage.interface';

/**
 * Интерфейс хранилища данных актуального состояния системы для текущего пользователя по каждой отдельной её части
 * (например, компоненту/элементу) или совокупности нескольких частей.
 */
export interface StorageInterface {
  /**
   * Хранилище данных актуального состояния системы, связанных с экраном устройства, на котором отображается приложение.
   */
  screen?: ScreenStorageInterface;

  /**
   * Хранилище данных актуального состояния системы, связанных со страницами приложения.
   */
  page?: PageGlobalStorageInterface;

  /**
   * Хранилище данных актуального состояния системы, связанных с пользователями.
   */
  user?: UserGlobalStorageInterface;

  /**
   * Хранилище данных актуального состояния системы, связанных с настройками приложения.
   */
  settings?: SettingsStorageInterface;
}
