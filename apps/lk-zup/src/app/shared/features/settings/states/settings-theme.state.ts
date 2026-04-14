import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from '../../../services/local-storage.service';
import { LangService } from '../../lang/services/lang.service';
import { SettingsThemeClass } from '../classes/settings-theme.class';
import { getThemeDetail, resolveTheme } from '../constants/theme.config';

@Injectable({
  providedIn: 'root',
})
export class SettingsThemeState {
  public entityName = 'theme';

  public geRxMethods: GeRxMethods = {
    edit: {
      main: this.changeTheme,
    },
  };

  constructor(
    private langService: LangService,
    private localstorageService: LocalStorageService,
    private settingsThemeClass: SettingsThemeClass
  ) {}

  changeTheme(name: string): Observable<void> {
    const resolvedTheme = resolveTheme(name);
    const detail = getThemeDetail(resolvedTheme);

    return of(
      this.settingsThemeClass.removeStyle(),
      this.settingsThemeClass.setStyle(detail.base),
      this.settingsThemeClass.setThemeDataAttr(detail.dataTheme),
      this.localstorageService.setTheme(resolvedTheme)
    );
  }
}
