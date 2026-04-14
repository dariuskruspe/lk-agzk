import { Injectable } from '@angular/core';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { CommunicationEvent } from '@shared/interfaces/event/communication-event.interface';
import { StorageInterface } from '@shared/interfaces/storage/storage.interface';
import { UserSettingsInterface } from '@shared/models/menu-condition.interface';
import { CommunicationService } from '@shared/services/communication.service';
import { ResponsiveHelperService } from '@shared/services/helpers/responsive-helper.service';
import { SettingsService } from '@shared/services/settings.service';
import { StorageService } from '@shared/services/storage.service';

/**
 * Вспомогательный сервис приложения (системы "ЛКС").
 *
 * Выступает в роли главного менеджера приложения, делегируя основную трудоёмкую работу другим сервисам-помощникам,
 * более подходящим для достижения конкретных целей.
 *
 * Нужен в первую очередь для того, чтобы сильно не разрастался код основного сервиса (AppService).
 *
 * Помимо этого, сервис предназначен для хранения всех необходимых побочных зависимостей AppService, которые
 * используются внутри методов.
 */
@Injectable({ providedIn: 'root' })
export class AppHelperService {
  constructor(
    // Other
    private communicator: CommunicationService,
    private responsiveHelper: ResponsiveHelperService,
    private settingsService: SettingsService,
    private storageService: StorageService
  ) {
    this.addSubscriptions();
  }

  addSubscriptions(): void {
    this.addCommunicationSubscription();
  }

  addCommunicationSubscription(): void {
    this.communicator.eventFor$('AppHelperService').subscribe({
      next: async (e: CommunicationEvent): Promise<void> => {
        await this.communicator.processEvent(e, this);
      },
    });
  }

  init(): any {
    this.initResponsiveHelper();
  }

  initResponsiveHelper(): void {
    this.responsiveHelper.init();
  }

  getStorage(): StorageInterface {
    return this.storageService.getStorage();
  }

  async globalSettingsHandler(): Promise<SettingsInterface> {
    return this.settingsService.globalSettingsHandler();
  }

  async userSettingsHandler(): Promise<UserSettingsInterface> {
    return this.settingsService.userSettingsHandler();
  }
}
