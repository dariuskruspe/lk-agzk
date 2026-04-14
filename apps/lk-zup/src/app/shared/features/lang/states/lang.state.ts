import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeRxMethods } from 'gerx/index.interface';
import { PrimeNGConfig } from 'primeng/api';
import { Observable, from, of } from 'rxjs';
import {
  CALENDER_CONFIG_EN,
  CALENDER_CONFIG_RU,
} from '../../../dictionaries/calendar-locale.dictionary';
import { LocalStorageService } from '../../../services/local-storage.service';
import { LangInterface } from '../interfaces/lang.interface';
import { LangService } from '../services/lang.service';

@Injectable({
  providedIn: 'root',
})
export class LangState {
  public entityName = 'lang';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.langService.getLang.bind(this.langService),
      success: this.getLangSuccess,
    },
    edit: {
      main: this.changeLang,
      success: this.changeLangSuccess,
    },
  };

  constructor(
    private langService: LangService,
    private localstorageService: LocalStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private config: PrimeNGConfig
  ) {}

  getLangSuccess(response: LangInterface): Observable<string> {
    return of(this.localstorageService.setCurrentLang(response));
  }

  changeLang(lang: string): Observable<string> {
    return of(this.localstorageService.setLang(lang));
  }

  changeLangSuccess(response: 'ru' | 'en'): Observable<any> {
    if (response === 'en') {
      this.config.setTranslation(CALENDER_CONFIG_EN);
    }
    if (response === 'ru') {
      this.config.setTranslation(CALENDER_CONFIG_RU);
    }

    window.location.reload();

    return from([]);

    // return of(
    //   this.router
    //     .navigateByUrl('null', { skipLocationChange: true })
    //     .then(() => {
    //       const urlSeparator = this.location.path().split('?');
    //       const routes = urlSeparator[0].split('/');
    //       const queryParams = urlSeparator[1]
    //         ? this.paramBuilder(urlSeparator[1])
    //         : {};
    //       this.router.navigate(routes, { queryParams }).then();
    //     })
    // );
  }

  paramBuilder(params: string): string[] {
    const queryParams: string[] = [];
    for (const param of params.split('&')) {
      const paramSeparator = param.split('=');
      queryParams[paramSeparator[0]] = paramSeparator[1];
    }
    return queryParams;
  }
}
