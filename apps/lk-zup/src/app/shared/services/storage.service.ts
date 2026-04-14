import { Injectable, signal } from '@angular/core';
import { AppThemeId } from '@shared/features/settings/models/theme.model';
import type { StorageInterface } from '@shared/interfaces/storage/storage.interface';

/**
 * Вспомогательный сервис для работы с хранилищем данных актуального состояния приложения (системы "ЛКС") для текущего
 * пользователя.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  storage: StorageInterface;

  constructor() {
    this.init();
  }

  init(): void {
    this.initStorage();
  }

  initStorage(): void {
    this.storage = {
      screen: {
        data: {
          frontend: {
            size: {
              signal: {
                // [Desktop]
                isDesktop: signal(false),
                isDesktopV: signal(false),
                isDesktopH: signal(false),

                // [Mobile (handset + tablet)]
                isMobile: signal(false),
                isMobileV: signal(false),
                isMobileH: signal(false),

                // [Handset]
                isHandset: signal(false),
                isHandsetV: signal(false),
                isHandsetH: signal(false),

                // [Tablet]
                isTablet: signal(false),
                isTabletV: signal(false),
                isTabletH: signal(false),
              },
            },

            type: {
              signal: {
                // [Touchscreen]
                isTouchscreen: signal(false),
              },
            },
          },
        },
      },

      page: {
        current: {
          data: {
            frontend: {
              signal: {
                // [URL]
                url: signal('/'),
                urlSegments: signal([]),
                urlQueryParams: signal({}),
                urlFragmentSignal: signal(null),

                // [Данные]
                isDataLoaded: signal(false),
              },
            },
          },
        },
      },

      user: {
        current: {
          data: {
            backend: {
              currentUser: null,
            },
            frontend: {
              signal: {
                // [Аватар]
                avatar: signal(''),
                photoURL: signal(''),

                // [Документы]
                isDocumentLoading: signal(false),
                isDocumentFileLoading: signal(false),
                openDocument: signal(null),
                openDocumentFileData: signal(null),
                openDocumentFileUint8Array: signal(null),
                lastOpenDocument: signal(null),

                // [Уведомления]
                alerts: signal(null),
              },
            },
          },
        },
      },

      settings: {
        data: {
          frontend: {
            signal: {
              // [Глобальные настройки]
              globalSettings: signal(null),

              // [Пользовательские настройки]
              userSettings: signal(null),

              // [Тема (цветовая схема)]
              theme: signal<AppThemeId | ''>(''),

              // [Язык]
              lang: signal(''),
              langTag: signal(''),
            },
          },
        },
      },
    };
  }

  getStorage(): StorageInterface {
    return this.storage;
  }
}
