import { WritableSignal } from '@angular/core';
import { StorageDataInterface } from '@shared/interfaces/storage/storage-data.interface';

/**
 * Интерфейс хранилища данных актуального состояния системы, связанных с экраном устройства, на котором отображается
 * приложение.
 */
export interface ScreenStorageInterface {
  /**
   * Данные, связанные с экраном устройства.
   */
  data?: StorageDataInterface<any, ScreenStorageFrontendDataInterface>;

  [key: string]: any;
}

export interface ScreenStorageFrontendDataInterface {
  /**
   * Frontend-данные актуального состояния системы, связанные с размерами экрана устройства.
   */
  size?: {
    /**
     * Frontend-данные, связанные с размерами экрана устройства, в виде сигналов.
     */
    signal: {
      /**
       * Сигнал, содержащий значение true или false в зависимости от того, соответствуют ли размеры экрана мобильному
       * устройству (tablet или handset).
       */
      isMobile: WritableSignal<boolean>;

      /**
       * Сигнал, содержащий значение true или false в зависимости от того, соответствуют ли размеры экрана мобильному
       * устройству (tablet или handset) в портретной (вертикальной) ориентации.
       */
      isMobileV: WritableSignal<boolean>;

      /**
       * Сигнал, содержащий значение true или false в зависимости от того, соответствуют ли размеры экрана мобильному
       * устройству (tablet или handset) в ландшафтной (горизонтальной) ориентации.
       */
      isMobileH: WritableSignal<boolean>;

      /**
       * Сигнал, содержащий значение true или false в зависимости от того, соответствуют ли размеры экрана мобильному
       * телефону (handset).
       */
      isHandset: WritableSignal<boolean>;

      /**
       * Сигнал, содержащий значение true или false в зависимости от того, соответствуют ли размеры экрана мобильному
       * телефону (handset) в портретной (вертикальной) ориентации.
       */
      isHandsetV: WritableSignal<boolean>;

      /**
       * Сигнал, содержащий значение true или false в зависимости от того, соответствуют ли размеры экрана мобильному
       * телефону (handset) в ландшафтной (горизонтальной) ориентации.
       */
      isHandsetH: WritableSignal<boolean>;

      /**
       * Сигнал, содержащий значение true или false в зависимости от того, соответствуют ли размеры экрана планшетному
       * компьютеру (tablet).
       */
      isTablet: WritableSignal<boolean>;

      /**
       * Сигнал, содержащий значение true или false в зависимости от того, соответствуют ли размеры экрана планшетному
       * компьютеру (tablet) в портретной (вертикальной) ориентации.
       */
      isTabletV: WritableSignal<boolean>;

      /**
       * Сигнал, содержащий значение true или false в зависимости от того, соответствуют ли размеры экрана планшетному
       * компьютеру (tablet) в ландшафтной (горизонтальной) ориентации.
       */
      isTabletH: WritableSignal<boolean>;

      /**
       * Сигнал, содержащий значение true или false в зависимости от того, соответствуют ли размеры экрана настольному
       * компьютеру (desktop).
       */
      isDesktop: WritableSignal<boolean>;

      /**
       * Сигнал, содержащий значение true или false в зависимости от того, соответствуют ли размеры экрана настольному
       * компьютеру (desktop) в портретной (вертикальной) ориентации.
       */
      isDesktopV: WritableSignal<boolean>;

      /**
       * Сигнал, содержащий значение true или false в зависимости от того, соответствуют ли размеры экрана настольному
       * компьютеру (desktop) в ландшафтной (горизонтальной) ориентации.
       */
      isDesktopH: WritableSignal<boolean>;
    };
  };

  /**
   * Frontend-данные актуального состояния системы, связанные с типом экрана устройства.
   */
  type?: {
    /**
     * Frontend-данные, связанные с типом экрана устройства, в виде сигналов.
     */
    signal: {
      /**
       * Сигнал, содержащий значение true или false в зависимости от того, является ли экран сенсорным (touch screen).
       */
      isTouchscreen: WritableSignal<boolean>;
    };
  };
}
