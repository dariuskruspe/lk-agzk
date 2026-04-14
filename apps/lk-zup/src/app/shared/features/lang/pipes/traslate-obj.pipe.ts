import { Pipe, PipeTransform } from '@angular/core';
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
    name: 'translateObj',
    standalone: false
})
export class TranslateObjPipe implements PipeTransform {
  readonly defaultLang = 'ru';

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

  transform<T>(obj: T, lang?: string): T {
    try {
      return this.translateObj<T>(obj, lang);
    } catch (e) {
      return obj;
    }
  }

  private translateObj<T>(obj: any, lang?: string): T {
    if (typeof obj !== 'object' || (obj as Date).toDateString) {
      if (typeof obj === 'string') {
        return (
          this.langPackages[
            lang || this.langFacade.getLang() || this.defaultLang
          ]?.[obj] || obj
        );
      }
      if (typeof obj === 'number') {
        return (obj?.toString() ?? obj) as any;
      }
      return obj;
    }

    let keys: string[] | number[];
    let modifiedObj: any;
    if (Array.isArray(obj)) {
      keys = obj.map((v, i) => i);
      modifiedObj = [...obj];
    } else {
      keys = Object.keys(obj);
      modifiedObj = { ...obj };
    }

    if (!keys?.length) {
      return obj;
    }

    keys.forEach((key) => {
      modifiedObj[key] = this.translateObj(obj[key], lang);
    });
    return modifiedObj;
  }
}
