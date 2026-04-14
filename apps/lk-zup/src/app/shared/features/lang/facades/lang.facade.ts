import { inject, Injectable } from '@angular/core';
import { AbstractFacade } from '@shared/classes/abstractions/abstract.facade';
import { LangState } from '@shared/features/lang/states/lang.state';
import { AppService } from '@shared/services/app.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { getBCP47Tag } from '@shared/utils/string/language/common';
import { GeRx } from 'gerx';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class LangFacade extends AbstractFacade<unknown> {
  app = inject(AppService);

  settingsStorage = this.app.storage.settings;

  langSignal = this.settingsStorage.data.frontend.signal.lang;

  langTagSignal = this.settingsStorage.data.frontend.signal.langTag;

  constructor(
    protected geRx: GeRx,
    protected store: LangState,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  showLang(): void {
    this.show();
  }

  getLang(): string {
    return this.localstorageService.getCurrentLang();
  }

  /**
   * Устанавливаем (применяем) язык в системе по переданному языковому коду.
   *
   * @param lang языковой код применяемого языка (например: 'ru' или 'en')
   */
  setLang(lang: string = 'en'): void {
    const currentLang: string = this.getLang();
    if (this.app.languageCodes.includes(lang) && currentLang !== lang) {
      this.edit(lang);
      moment.locale(lang);
      this.updateLangSignals(lang);
    }
  }

  /**
   * Обновляем значения языковых сигналов в хранилище настроек приложения.
   *
   * @param lang языковой код выбранного в системе языка (например: 'ru' или 'en')
   */
  updateLangSignals(lang: string = this.getLang() || 'en') {
    if (this.app.languageCodes.includes(lang)) {
      const bcp47Tag: string = getBCP47Tag(lang);
      this.langSignal.set(lang);
      this.langTagSignal.set(bcp47Tag);
    }
  }
}
