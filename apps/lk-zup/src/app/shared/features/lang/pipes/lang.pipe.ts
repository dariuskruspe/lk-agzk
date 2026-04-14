import { inject, Pipe, PipeTransform } from '@angular/core';
import { AppService } from '@shared/services/app.service';
import { BaPackageEnum } from '../dictionaries/ba-package.enum';
import { CePackageEnum } from '../dictionaries/ce-package.enum';
import { CvPackageEnum } from '../dictionaries/cv-package.enum';
import { DePackageEnum } from '../dictionaries/de-package.enum';
import { EnPackageEnum } from '../dictionaries/en-package.enum';
import { HyPackageEnum } from '../dictionaries/hy-package.enum';
import { RuPackageEnum } from '../dictionaries/ru-package.enum';
import { TjPackageEnum } from '../dictionaries/tj-package.enum';
import { TtPackageEnum } from '../dictionaries/tt-package.enum';
import { UzPackageEnum } from '../dictionaries/uz-package.enum';
import { LangFacade } from '../facades/lang.facade';

@Pipe({
  name: 'translate',
  standalone: false,
})
export class TranslatePipe implements PipeTransform {
  app = inject(AppService);

  readonly defaultLang = 'ru';
  readonly fallbackLang = 'ru';

  readonly langPackages = {
    ru: RuPackageEnum, // Русский
    en: EnPackageEnum, // Английский
    tt: TtPackageEnum, // Татарский
    uz: UzPackageEnum, // Узбекский
    tj: TjPackageEnum, // Таджикский
    de: DePackageEnum, // Немецкий
    ce: CePackageEnum, // Чеченский
    ba: BaPackageEnum, // Башкирский
    cv: CvPackageEnum, // Чувашский
    hy: HyPackageEnum, // Армянский
  };

  constructor(private langFacade: LangFacade) {}

  transform(
    langConst: string,
    interpolationParams: { [key: string]: string } = null,
    lang?: string,
    ...args: any[]
  ): string {
    if (!langConst?.length) {
      return '';
    }

    let selectedLang: string =
      lang || this.langFacade.getLang() || this.defaultLang;

    if (!this.app.languageCodes.includes(selectedLang)) {
      selectedLang = this.defaultLang;
    }

    const translatedValue =
      this.langPackages[selectedLang]?.[langConst] ||
      this.langPackages[this.fallbackLang]?.[langConst] ||
      langConst;

    // интерполируем параметры в двойных фигурных скобочках (при наличии) для подстановки необходимых значений в результирующую фразу
    if (translatedValue && typeof translatedValue === 'string') {
      if (interpolationParams && typeof interpolationParams === 'object') {
        const paramKeys: string[] = Object.keys(interpolationParams);

        if (paramKeys.length) {
          return paramKeys.reduce(
            (acc, key) =>
              acc.replace(
                new RegExp(`{{${key}}}`, 'g'),
                interpolationParams[key],
              ),
            translatedValue,
          );
        }
      }
    }

    return translatedValue || langConst;
  }

  daysLabel(days: number): string {
    const lastDigit = days % 10;
    const lastTwoDigits = days % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return `${days} ${this.transform('PLURAL_DAYS')}`;
    }
    if (lastDigit === 1) {
      return `${days} ${this.transform('ONE_DAY')}`;
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return `${days} ${this.transform('TWO_DAYS')}`;
    }
    return `${days} ${this.transform('PLURAL_DAYS')}`;
  }
}
