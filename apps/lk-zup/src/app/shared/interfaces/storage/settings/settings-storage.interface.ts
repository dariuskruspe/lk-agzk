import { WritableSignal } from '@angular/core';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { AppThemeId } from '@shared/features/settings/models/theme.model';
import { StorageDataInterface } from '@shared/interfaces/storage/storage-data.interface';
import { UserSettingsInterface } from '@shared/models/menu-condition.interface';

/**
 * Интерфейс хранилища данных актуального состояния системы, связанных с настройками приложения.
 */
export interface SettingsStorageInterface {
  /**
   * Данные, связанные с настройками приложения.
   */
  data?: StorageDataInterface<
    SettingsStorageBackendDataInterface,
    SettingsStorageFrontendDataInterface
  >;

  [key: string]: any;
}

export interface SettingsStorageBackendDataInterface {
  [key: string]: any;
}

export interface SettingsStorageFrontendDataInterface {
  /**
   * Frontend-данные актуального состояния системы, связанные с настройками приложения, в виде сигналов.
   */
  signal?: {
    /**
     * Сигнал, содержащий глобальные настройки ЛКС, получаемые с бэка при помощи эндпоинта /wa_global/settings.
     */
    globalSettings: WritableSignal<SettingsInterface>;

    /**
     * Сигнал, содержащий пользовательские настройки ЛКС, получаемые с бэка при помощи эндпоинта /wa_users/sectionsSettings.
     */
    userSettings: WritableSignal<UserSettingsInterface>;

    /**
     * Сигнал, содержащий canonical-id выбранной темы приложения (например: 'light' или 'default_legacy').
     */
    theme: WritableSignal<AppThemeId | ''>;

    /**
     * Сигнал, содержащий строку с выбранным языком (например: 'ru' или 'en').
     */
    lang: WritableSignal<string>;

    /**
     * Сигнал, содержащий строку с тегом выбранного в системе языка (например: 'ru-RU' или 'en-EN') по стандарту
     * IETF BCP 47 (IETF BCP +84 language tag).
     *
     * https://en.wikipedia.org/wiki/IETF_language_tag
     */
    langTag: WritableSignal<string>;
  };
}
