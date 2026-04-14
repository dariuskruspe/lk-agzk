import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  HostListener,
} from '@angular/core';
import { LayoutService } from '../layout.service';
import { RouterOutlet } from '@angular/router';
import { SettingsInterface } from '@app/shared/features/settings/models/settings.interface';
import { GlobalSettingsStateService } from '@app/shared/states/global-settings-state.service';
import { SectionSettingsStateService } from '@app/shared/states/section-settings-state.service';
import { UserStateService } from '@app/shared/states/user-state.service';
import { MainCurrentUserFacade } from '@app/features/main/facades/main-current-user.facade';
import { SharedStateService } from '@app/shared/states/shared-state.service';
import { SessionService } from '@app/shared/services/session.service';
import { ApiResourceService } from '@app/shared/services/api-resource/api-resource.service';
import { AppService } from '@app/shared/services/app.service';
import { MainSidebarService } from '../../features/main/services/main-sidebar.service';
import { LucideAngularModule, MenuIcon } from 'lucide-angular';
import { LogoComponent } from '@app/shared/components/logo/logo.component';

@Component({
  selector: 'app-layout-main-v2',
  imports: [RouterOutlet, LucideAngularModule, LogoComponent],
  templateUrl: './layout-main-v2.component.html',
  styleUrl: './layout-main-v2.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutMainV2Component {
  layout = inject(LayoutService);
  app = inject(AppService);
  globalSettingsState = inject(GlobalSettingsStateService);
  sectionSettingsState = inject(SectionSettingsStateService);
  userState = inject(UserStateService);
  currentUserFacade = inject(MainCurrentUserFacade);
  sharedState = inject(SharedStateService);
  sessionService = inject(SessionService);
  apiResourceService = inject(ApiResourceService);
  sidebarService = inject(MainSidebarService);

  showPage = signal(false);

  // Мобильное состояние
  isMobile = this.sidebarService.isMobile;
  isMobileMenuOpen = this.sidebarService.isMobileMenuOpen;

  readonly MenuIcon = MenuIcon;

  async ngOnInit() {
    await Promise.all([this.globalSettingsState.loadOnce()]);

    const settings: SettingsInterface = this.globalSettingsState.state();

    if (settings.cache?.enable) {
      this.apiResourceService.enableCache();
      await this.sessionService.fetchCacheChangedTime();
      console.log('cacheChangedTime', this.sessionService.cacheChangedTime());
    }

    // загрузка пользователя
    await this.userState.loadOnce();
    // поддержка легаси
    this.currentUserFacade.getCurrentUser();

    this.showPage.set(true);

    await Promise.all([
      this.sharedState.loadOnce(),
      this.sectionSettingsState.loadOnce(),
    ]);

    this.app.setGlobalSettings(this.globalSettingsState.state());
    this.app.setUserSettings(this.sectionSettingsState.state());
  }

  // Управление мобильным меню
  toggleMobileMenu(): void {
    this.sidebarService.toggleMobileMenu();
  }

  // Закрытие мобильного меню при клике на overlay
  closeMobileMenu(): void {
    this.sidebarService.closeMobileMenu();
  }

  // Закрытие мобильного меню при изменении размера на desktop
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (!this.isMobile()) {
      this.sidebarService.closeMobileMenu();
    }
  }
}
