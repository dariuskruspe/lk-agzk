import { PageStorageInterface } from '@shared/interfaces/storage/page/page-storage.interface';

/**
 * Интерфейс хранилища данных актуального состояния системы, связанных со страницами приложения.
 */
export interface PageGlobalStorageInterface {
  /**
   * Хранилище данных актуального состояния системы, связанных с текущей страницей приложения.
   */
  current?: PageStorageInterface;
}
