import { Pipe, PipeTransform } from '@angular/core';
import { EnPackageEnum } from '../dictionaries/en-package.enum';
import { RuPackageEnum } from '../dictionaries/ru-package.enum';
import { LocaleService } from '../services/locale.service';
import { TtPackageEnum } from '@app/shared/features/lang/dictionaries/tt-package.enum';
import { UzPackageEnum } from '@app/shared/features/lang/dictionaries/uz-package.enum';
import { TjPackageEnum } from '@app/shared/features/lang/dictionaries/tj-package.enum';
import { CePackageEnum } from '@app/shared/features/lang/dictionaries/ce-package.enum';

@Pipe({
    name: 'translate',
    standalone: false
})
export class TranslatePipe implements PipeTransform {
  private readonly langPackages = {
    ru: RuPackageEnum,
    en: EnPackageEnum,
    tt: TtPackageEnum,
    uz: UzPackageEnum,
    tj: TjPackageEnum,
    ce: CePackageEnum,
  };

  constructor(private locale: LocaleService) {}

  transform(
    langConst: string,
    interpolationParams: { [key: string]: string } = null,
    lang?: string,
    ...args: any[]
  ): string {
    if (!langConst?.length) {
      return '';
    }

    let selectedLang: string = lang || this.locale.value;

    const translatedValue = this.langPackages[selectedLang]?.[langConst];

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
}
