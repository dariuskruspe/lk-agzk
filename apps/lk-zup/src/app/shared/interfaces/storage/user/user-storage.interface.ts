import { WritableSignal } from '@angular/core';
import { DocumentInterface } from '@features/agreements/models/document.interface';
import { AlertsInterface } from '@features/main/models/alerts.interface';
import { MainCurrentUserInterface } from '@features/main/models/main-current-user.interface';
import { FileDataInterface } from '@shared/interfaces/file/file-data.interface';
import { StorageDataInterface } from '@shared/interfaces/storage/storage-data.interface';

/**
 * Интерфейс хранилища данных актуального состояния системы, связанных с конкретным пользователем.
 */
export interface UserStorageInterface {
  /**
   * Данные, связанные с пользователем.
   */
  data?: StorageDataInterface<
    UserStorageBackendDataInterface,
    UserStorageFrontendDataInterface
  >;

  [key: string]: any;
}

export interface UserStorageBackendDataInterface {
  /**
   * Данные пользователя (с бэка).
   */
  currentUser?: MainCurrentUserInterface;
}

export interface UserStorageFrontendDataInterface {
  /**
   * Frontend-данные пользователя в виде сигналов.
   */
  signal: {
    /*--------*/
    /* Аватар */
    /*--------*/

    /**
     * Сигнал, содержащий аватар пользователя (строку в виде data URL, содержащую base64-изображение, используемое в
     * качестве аватарки пользователя).
     */
    avatar?: WritableSignal<string>;

    /**
     * Сигнал, содержащий URL фотографии пользователя (старый механизм аватарки).
     */
    photoURL?: WritableSignal<string>;

    /*-----------*/
    /* Документы */
    /*-----------*/

    /**
     * Сигнал, содержащий значение true или false в зависимости от того, происходит ли в настоящее время загрузка
     * документа пользователя.
     */
    isDocumentLoading: WritableSignal<boolean>;

    /**
     * Сигнал, содержащий значение true или false в зависимости от того, происходит ли в настоящее время загрузка
     * файла документа пользователя.
     */
    isDocumentFileLoading: WritableSignal<boolean>;

    /**
     * Сигнал, содержащий текущий открытый документ пользователя.
     */
    openDocument?: WritableSignal<DocumentInterface>;

    /**
     * Сигнал, содержащий данные файла текущего открытого документа пользователя (см. интерфейс FileDataInterface).
     */
    openDocumentFileData?: WritableSignal<FileDataInterface>;

    /**
     * Сигнал, содержащий двоичные данные файла текущего открытого документа пользователя (в виде Uint8Array).
     */
    openDocumentFileUint8Array?: WritableSignal<Uint8Array>;

    /**
     * Сигнал, содержащий последний открытый документ пользователя.
     */
    lastOpenDocument?: WritableSignal<DocumentInterface>;

    /*-------------*/
    /* Уведомления */
    /*-------------*/

    /**
     * Сигнал, содержащий оповещения (уведомления) для пользователя.
     */
    alerts?: WritableSignal<AlertsInterface>;
  };
}
