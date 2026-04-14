import { computed, inject, Injectable, WritableSignal } from '@angular/core';
import { Params, RedirectCommand, Router } from '@angular/router';
import { Languages } from '@features/main/constants/languages';
import {
  Environment,
  EnvironmentInterface,
} from '@shared/classes/ennvironment/environment';
import type { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import type { CommunicationEvent } from '@shared/interfaces/event/communication-event.interface';
import type { StorageInterface } from '@shared/interfaces/storage/storage.interface';
import type { UserSettingsInterface } from '@shared/models/menu-condition.interface';
import { CommunicationService } from '@shared/services/communication.service';
import { StorageService } from '@shared/services/storage.service';
import { logDebug } from '@shared/utilits/logger';

/**
 * Основной сервис приложения (системы "ЛКС").
 *
 * При обращении к сервису рекомендуется (это необязательно, но так лаконичнее ^_^) использовать сокращение "app".
 *
 * (!) Не рекомендуется (отрицательно рекомендуется ^_^) внедрять в этот сервис зависимости, которые могут содержать
 * другие зависимости во избежание появления circular dependencies (циклических ["круговых"] зависимостей, поскольку
 * среди дочерних зависимостей могут быть те, что зависят от AppService. Вместо этого желательно использовать сервис
 * коммуникации (см. CommunicationService).
 */
@Injectable({ providedIn: 'root' })
export class AppService {
  router: Router = inject(Router);

  apiUrl = computed(() => {
    const env = Environment.inv();
    const hostName = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : '';

    if (hostName === 'localhost') {
      return `https://empl-dev.test-wa.ru/data`;
    }
    return `${protocol}//${hostName}${port}/data`;
  });

  env: EnvironmentInterface = Environment.inv();

  /**
   * Языковые коды поддерживаемых в системе языков.
   */
  languageCodes: string[] = Languages.map((l) => l.value);

  /*--------------------------------------------------------------------------*/
  /* ХРАНИЛИЩЕ ДАННЫХ АКТУАЛЬНОГО СОСТОЯНИЯ СИСТЕМЫ ДЛЯ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ */
  /*--------------------------------------------------------------------------*/

  /**
   * Хранилище данных актуального состояния системы для текущего пользователя (в том числе данных, хранящих текущие
   * состояния элементов пользовательского интерфейса) по каждой отдельной её части (например, компоненту/элементу) или
   * совокупности нескольких частей.
   *
   * Под данными актуального состояния системы понимаются любые её данные, являющиеся последними, то есть самыми
   * "свежими", на текущий момент времени (например, последние поступившие на текущий момент времени сокет-данные, даже
   * если они поступили, к примеру, час назад).
   *
   * Для удобства структурирования данных и последующей работы с ними хранилище рекомендуется разбивать на несколько
   * внутренних хранилищ (подхранилищ), каждое из которых отвечает за определённую сущность на бэке или иным образом
   * группирует содержащиеся внутри себя элементы.
   *
   * Подробнее об иерархии (и типах) данных конкретного подхранилища можно узнать, заглянув в его интерфейс, который
   * можно найти внутри StorageInterface.
   */
  get storage(): StorageInterface {
    return this.storageService.getStorage();
  }

  theme = computed(() => this.storage.settings.data.frontend.signal.theme());

  constructor(
    private communicator: CommunicationService,
    private storageService: StorageService,
  ) {
    this.init().then(() => {});
  }

  private async init(): Promise<void> {
    this.addSubscriptions();

    await this.initAppHelper();
  }

  private async initAppHelper(): Promise<void> {
    const requestEventId: number = this.communicator.sendEvent({
      type: 'req',
      action: { type: 'call' },
      from: { name: 'AppService' },
      to: { name: 'AppHelperService' },
      fn: {
        name: 'init',
        callerName: 'init',
      },
    });

    const responseEvent =
      await this.communicator.getResponseEvent(requestEventId);

    this.communicator.removeEventsByIds([requestEventId, responseEvent.id]);

    // console.log(`initCallResultEvent`, responseEvent);
  }

  addSubscriptions(): void {
    this.addCommunicationSubscription();
  }

  addCommunicationSubscription(): void {
    this.communicator.eventFor$('AppService').subscribe({
      next: async (e: CommunicationEvent): Promise<void> => {
        await this.communicator.processEvent(e, this);
      },
    });
  }

  async globalSettingsHandler(): Promise<void> {
    const requestEventId: number = this.communicator.sendEvent({
      type: 'req',
      action: { type: 'call' },
      from: { name: 'AppService' },
      to: { name: 'AppHelperService' },
      fn: {
        name: 'globalSettingsHandler',
        callerName: 'globalSettingsHandler',
      },
    });

    const responseEvent =
      await this.communicator.getResponseEvent(requestEventId);

    const settings: SettingsInterface = responseEvent?.result;

    if (!settings) return;

    this.setGlobalSettings(settings);
    if (settings.general.languages?.length) {
      this.setLanguages(settings.general.languages);
    }
    logDebug(`global settings:`, settings);
  }

  async userSettingsHandler(): Promise<void> {
    const requestEventId: number = this.communicator.sendEvent({
      type: 'req',
      action: { type: 'call' },
      from: { name: 'AppService' },
      to: { name: 'AppHelperService' },
      fn: {
        name: 'userSettingsHandler',
        callerName: 'userSettingsHandler',
      },
    });

    const responseEvent =
      await this.communicator.getResponseEvent(requestEventId);

    const userSettings: UserSettingsInterface = responseEvent?.result;

    if (!userSettings) return;

    this.communicator.removeEventsByIds([requestEventId, responseEvent.id]);

    this.setUserSettings(userSettings);
    logDebug(`user settings:`, userSettings);
  }

  setGlobalSettings(globalSettings: SettingsInterface): void {
    this.storage.settings.data.frontend.signal.globalSettings.set(
      globalSettings,
    );
  }

  setLanguages(languages: string[]): void {
    this.languageCodes = Languages.filter((lang) =>
      languages.includes(lang.value),
    ).map((l) => l.value);
  }

  /**
   * Глобальные настройки ЛКС, получаемые с бэка при помощи эндпоинта /wa_global/settings.
   */
  get globalSettings(): SettingsInterface {
    return this.storage.settings.data.frontend.signal.globalSettings();
  }

  /**
   * Глобальные настройки ЛКС, получаемые с бэка при помощи эндпоинта /wa_global/settings.
   */
  get settings(): SettingsInterface {
    return this.globalSettings;
  }

  /**
   * Сигнал, содержащий глобальные настройки ЛКС, получаемые с бэка при помощи эндпоинта /wa_global/settings.
   */
  get globalSettingsSignal(): WritableSignal<SettingsInterface> {
    return this.storage.settings.data.frontend.signal.globalSettings;
  }

  /**
   * Сигнал, содержащий глобальные настройки ЛКС, получаемые с бэка при помощи эндпоинта /wa_global/settings.
   */
  get settingsSignal(): WritableSignal<SettingsInterface> {
    return this.globalSettingsSignal;
  }

  setUserSettings(userSettings: UserSettingsInterface): void {
    this.userSettingsSignal.set(userSettings);
  }

  /**
   * Пользовательские настройки ЛКС, получаемые с бэка при помощи эндпоинта /wa_users/sectionsSettings.
   */
  get userSettings(): UserSettingsInterface {
    return this.storage.settings.data.frontend.signal.userSettings();
  }

  /**
   * Сигнал, содержащий пользовательские настройки ЛКС, получаемые с бэка при помощи эндпоинта
   * /wa_users/sectionsSettings.
   */
  get userSettingsSignal(): WritableSignal<UserSettingsInterface> {
    return this.storage.settings.data.frontend.signal.userSettings;
  }

  /**
   * Обновляем страницу приложения путём перехода на тот же самый URL роутера (например, чтобы подтянуть новые
   * backend-данные).
   */
  async refresh(): Promise<void> {
    const currentURL: string = this.router.url;
    await this.router.navigateByUrl('/', { skipLocationChange: true });
    await this.router.navigateByUrl(currentURL);
  }

  reload(): void {
    window.document.location.reload();
  }

  redirectToLoginPage(queryParams?: Params) {
    if (Environment.inv().loginPageExternal) {
      window.location.href = Environment.inv().loginPageExternal;
    }

    window.location.href = `/auth?${new URLSearchParams(queryParams).toString()}`;
  }

  redirectToLoginPageCommand(queryParams?: Params) {
    if (Environment.inv().loginPageExternal) {
      window.location.href = Environment.inv().loginPageExternal;
    }

    const authUrl = this.router.parseUrl('/auth');
    if (queryParams) {
      authUrl.queryParams = queryParams;
    }
    return new RedirectCommand(authUrl);
  }
}
