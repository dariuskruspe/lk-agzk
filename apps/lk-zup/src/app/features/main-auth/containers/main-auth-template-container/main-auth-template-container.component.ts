import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AppService } from '@shared/services/app.service';
import { LangFacade } from '../../../../shared/features/lang/facades/lang.facade';
import { SettingsJivositeFacade } from '../../../../shared/features/settings/facades/settings-jivosite.facade';
import { SettingsThemeFacade } from '../../../../shared/features/settings/facades/settings-theme.facade';
import { SettingsFacade } from '../../../../shared/features/settings/facades/settings.facade';
import {
  BOOTSTRAP_PARAMS,
  BootstrapParamsInterface,
} from '../../../../shared/models/bootstrap-params.interface';
import { InitialLoadingService } from '../../../../shared/services/initial-loading.service';
import { MainMenuVisibilityService } from '../../../main/services/main-menu-visibility.service';

@Component({
    selector: 'app-main-auth-template-container',
    templateUrl: './main-auth-template-container.component.html',
    styleUrls: ['./main-auth-template-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class MainAuthTemplateContainerComponent implements OnInit, OnDestroy {
  app = inject(AppService);

  constructor(
    private langFacade: LangFacade,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private settingsJivositeFacade: SettingsJivositeFacade,
    private settingsThemeFacade: SettingsThemeFacade,
    public settingsFacade: SettingsFacade,
    @Optional()
    @Inject(BOOTSTRAP_PARAMS)
    public params: BootstrapParamsInterface,
    private initialLoading: InitialLoadingService,
    private mainMenuVisibilityService: MainMenuVisibilityService,
  ) {
    this.matIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `./assets/img/svg/sprite.svg`,
      ),
    );
    this.initialLoading.setWelcomeStatus(true);
  }

  ngOnInit(): void {
    document.body.setAttribute('data-overflow', 'auto');

    this.mainMenuVisibilityService.setItems([]);

    const settingsDataSubscribe = this.settingsFacade
      ?.getData$()
      .subscribe((settings) => {
        if (settings?.jivosite?.enable && settings?.jivosite?.showOnAllPages) {
          this.settingsJivositeFacade.installScript('auth');
        }
        settingsDataSubscribe.unsubscribe();
      });
  }

  quit(): void {
    this.params?.quit();
  }

  changeLang(lang: string): void {
    this.langFacade.setLang(lang);
  }

  themeChange(themeName: string): void {
    this.settingsThemeFacade.setTheme(themeName);
  }

  ngOnDestroy(): void {
    document.body.removeAttribute('data-overflow');

    if (
      this.settingsFacade?.getData()?.jivosite?.enable &&
      this.settingsFacade?.getData()?.jivosite?.showOnAuthorizationPage
    ) {
      this.settingsJivositeFacade.uninstallScript();
    }
  }
}
