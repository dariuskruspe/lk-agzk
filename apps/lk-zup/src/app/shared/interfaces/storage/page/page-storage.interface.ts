import { WritableSignal } from '@angular/core';
import { Params, UrlSegment } from '@angular/router';
import { StorageDataInterface } from '@shared/interfaces/storage/storage-data.interface';

/**
 * Интерфейс хранилища данных актуального состояния системы, связанных с конкретной страницей приложения.
 */
export interface PageStorageInterface {
  /**
   * Данные, связанные со страницей приложения.
   */
  data?: StorageDataInterface<
    PageStorageBackendDataInterface,
    PageStorageFrontendDataInterface
  >;

  [key: string]: any;
}

export interface PageStorageBackendDataInterface {
  [key: string]: any;
}

export interface PageStorageFrontendDataInterface {
  /**
   * Frontend-данные страницы приложения в виде сигналов.
   */
  signal: {
    /**
     * Сигнал, содержащий строку в виде URL, соответствующего текущей странице приложения (например, '/vacations' для
     * страницы "График отпусков").
     */
    url?: WritableSignal<string>;

    /**
     * Сигнал, содержащий сегменты (части) URL, соответствующего текущей странице приложения.
     */
    urlSegments?: WritableSignal<UrlSegment[]>;

    /**
     * Сигнал, содержащий параметры запроса URL, соответствующего текущей странице приложения.
     */
    urlQueryParams?: WritableSignal<Params>;

    /**
     * Сигнал, содержащий фрагмент URL, соответствующего текущей странице приложения.
     */
    urlFragmentSignal?: WritableSignal<string>;

    /**
     * Сигнал, содержащий значение true или false в зависимости от того, загрузились ли все необходимые данные на
     * отображаемой странице приложения.
     */
    isDataLoaded?: WritableSignal<boolean>;
  };
}
