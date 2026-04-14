import { inject, Injectable } from '@angular/core';
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

@Injectable({
  providedIn: 'root',
})
export class LangUtils {
  app = inject(AppService);

  ru = RuPackageEnum; // Русский

  en = EnPackageEnum; // Английский

  tt = TtPackageEnum; // Татарский

  uz = UzPackageEnum; // Узбекский

  tj = TjPackageEnum; // Таджикский

  de = DePackageEnum; // Немецкий

  ce = CePackageEnum; // Чеченский

  ba = BaPackageEnum; // Башкирский

  cv = CvPackageEnum; // Чувашский

  hy = HyPackageEnum; // Армянский

  convert(lang: string, translateKey: string): string {
    if (this.app.languageCodes.includes(lang) && translateKey) {
      return this[lang][translateKey];
    }

    return this.ru[translateKey] || '';
  }
}
