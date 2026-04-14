import { SectionSettingsStateService } from '@app/shared/states/section-settings-state.service';
import { computed, inject, Injectable, signal } from '@angular/core';
import { TranslatePipe } from '@shared/features/lang/pipes/lang.pipe';
import {
  CustomMenuItemInterface,
  MenuConditionInterface,
} from '@shared/models/menu-condition.interface';
import { GlobalSettingsStateService } from '@app/shared/states/global-settings-state.service';
import { UserStateService } from '@app/shared/states/user-state.service';
import { IsActiveMatchOptions, NavigationEnd, Router } from '@angular/router';
import { type LucideIconData } from 'lucide-angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import {
  SIDEBAR_MENU_ITEMS,
  SIDEBAR_USER_MENU_ITEMS,
} from './main-siderbar-menu-items';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SettingsThemeFacade } from '@shared/features/settings/facades/settings-theme.facade';
import Version from '../../../../version/version.json';
import { Languages } from '../constants/languages';
import { LangFacade } from '@shared/features/lang/facades/lang.facade';
import { MainNotificationsService } from './main-notifications.service';
import { UnsignedAgreementsFacade } from '@features/agreements/facades/unsigned-agreements.facade';
import { groupBy, keyBy } from 'lodash';
import { MenuItem } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class MainSidebarService {
  private router = inject(Router);
  private sectionSettingsState = inject(SectionSettingsStateService);
  private settingsThemeFacade = inject(SettingsThemeFacade);
  private globalSettingsState = inject(GlobalSettingsStateService);
  private userState = inject(UserStateService);
  private localStorageService = inject(LocalStorageService);
  private breakpointObserver = inject(BreakpointObserver);
  private translatePipe = inject(TranslatePipe);
  private langFacade = inject(LangFacade);
  private mainNotificationsService = inject(MainNotificationsService);
  private unsignedAgreementsFacade = inject(UnsignedAgreementsFacade);

  isLoading = this.sectionSettingsState.loading;

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.url),
    ),
  );

  private allItems = signal(SIDEBAR_MENU_ITEMS);

  private _isCollapsed = signal(this.localStorageService.getSidebarCollapsed());
  isCollapsed = this._isCollapsed.asReadonly();

  // Мобильное состояние sidebar
  private _isMobileMenuOpen = signal(false);
  isMobileMenuOpen = this._isMobileMenuOpen.asReadonly();

  // Определение мобильного устройства
  isMobile = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(map((result) => result.matches)),
    { initialValue: this.breakpointObserver.isMatched(Breakpoints.Handset) },
  );

  userMenuConditions = computed<MenuConditionInterface>(() => {
    return {
      settings: this.globalSettingsState.state(),
      signLater: !!this.unsignedAgreementsFacade.dataSignal()?.documents?.length,
      currentUser: this.userState.current(),
      authType: this.globalSettingsState.state().general.authType !== 'sso',
      userSettings: this.sectionSettingsState.state(),
    };
  });

  customMenuItemsMap = computed<Record<string, CustomMenuItemInterface[]>>(
    () => {
      const sectionSettings = this.sectionSettingsState.state();
      if (!sectionSettings) {
        return {};
      }
      return groupBy(sectionSettings.custom, 'parent');
    },
  );

  items = computed<SidebarItem[]>(() => {
    const sectionSettings = this.sectionSettingsState.state();
    if (!sectionSettings) {
      return [];
    }

    const currentUrl = this.currentUrl();
    const all = this.allItems();

    const menuCondition = this.userMenuConditions();

    return all
      .map((item) => {
        const children = [
          ...this.getCustomMenuItems(item.groupName),
          ...(item.items?.filter(
            (i) =>
              !i.state?.getVisibility ||
              i.state?.getVisibility?.(menuCondition),
          ) ?? []),
        ].map((i) => ({
          id: i.nameId ?? i.label ?? JSON.stringify(i),
          title: this.translatePipe.transform(i.label),
          link: i.routerLink ?? '',
          isActive: this.router.isActive(i.routerLink, {
            paths: 'subset',
            matrixParams: 'ignored',
            queryParams: 'ignored',
            fragment: 'ignored',
          }),
        }));
        console.log(children);

        const isActive =
          item.routerLink &&
          this.router.isActive(item.routerLink, {
            paths: 'exact',
            matrixParams: 'ignored',
            queryParams: 'ignored',
            fragment: 'ignored',
          });

        const childrenIsActive = children.some((i) => i.isActive);

        return {
          id: item.nameId ?? item.label ?? JSON.stringify(item),
          title: this.translatePipe.transform(item.label),
          icon: item.icon,
          isActive: isActive || childrenIsActive,
          link: item.routerLink ?? '',
          routerLinkActiveOptions: item.routerLinkActiveOptions,
          children,
          type: 'normal',
        } as SidebarItem;
      })
      .filter((i) => i.link || i.children?.length);
  });

  userMenuItems = computed(() => {
    const customItems = this.getCustomMenuItems('profile');

    const all = [
      [...customItems, ...SIDEBAR_USER_MENU_ITEMS[0]],
      ...SIDEBAR_USER_MENU_ITEMS.slice(1),
    ];

    const menuCondition = this.userMenuConditions();

    return all.map((items, index) => {
      const visibleItems =
        items?.filter(
          (i) =>
            !i.state?.getVisibility || i.state?.getVisibility?.(menuCondition),
        ) ?? [];

      return visibleItems.map((i) => ({
        id: i.nameId ?? i.label ?? JSON.stringify(i),
        title: this.translatePipe.transform(i.label),
        icon: i.icon,
        iconType: i.iconType || 'lucide',
        link: i.routerLink ?? '',
        isActive: this.router.isActive(i.routerLink, {
          paths: 'subset',
          matrixParams: 'ignored',
          queryParams: 'ignored',
          fragment: 'ignored',
        }),
      }));
    });
  });

  user = computed(() => {
    const user = this.userState.current();
    if (!user) {
      return null;
    }

    const avatar = user.photo
      ? `data:image/${user.imageExt};base64,${user.image64}`
      : '';

    const displayName = `${user.forename} ${user.surname}`;

    return {
      ...user,
      avatar,
      displayName,
      currentEmployeeId: this.userState.activeEmployeeId(),
    };
  });

  themes = computed(() => {
    const currentTheme = this.settingsThemeFacade.theme();
    console.log(currentTheme);

    return this.settingsThemeFacade.themes().map((theme) => ({
      title: this.translatePipe.transform(theme.title),
      value: theme.value,
      base: theme.base,
      isActive: theme.value === currentTheme,
      light: theme.light,
    }));
  });

  langButtonEnabled = computed(() => {
    const settings = this.globalSettingsState.state();
    return settings?.header?.langButton?.enable ?? true;
  });

  languages = computed(() => {
    const current = this.langFacade.langSignal();
    const settings = this.globalSettingsState.state();
    const enabledLanguages = settings?.general?.languages ?? [];

    let result = Languages;

    if (enabledLanguages.length) {
      result = result.filter((language) =>
        enabledLanguages.includes(language.value),
      );
    }

    return result.map((language) => ({
      ...language,
      isActive: language.value === current,
    }));
  });

  appVersion = computed(() => {
    const settings = this.globalSettingsState.state();
    return `v.${Version.version} | ${settings?.general?.version ?? ''}`;
  });

  showNotificationsOverlay = signal(false);
  showUserMenuOverlay = signal(false);

  unreadNotificationsCount = signal(0);

  private getCustomMenuItems(parent: string) {
    const customItemsMap = this.customMenuItemsMap();
    return (customItemsMap[parent] ?? []).map((item) => {
      return {
        nameId: item.id,
        label: item.name,
        icon: item.iconName || 'pi pi-pen-to-square',
        iconType: 'classname',
        routerLink: `/custom/${item.id}`,
        id: item.id,
        state: {
          getVisibility: (data: MenuConditionInterface) => item.visible,
        },
      };
    });
  }

  toggle() {
    this._isCollapsed.update((collapsed) => !collapsed);
    this.localStorageService.setSidebarCollapsed(this._isCollapsed());
  }

  // Управление мобильным меню
  toggleMobileMenu() {
    this._isMobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu() {
    this._isMobileMenuOpen.set(false);
  }

  openMobileMenu() {
    this._isMobileMenuOpen.set(true);
  }

  showNotifications() {
    this.showNotificationsOverlay.set(true);
  }

  closeNotifications() {
    this.showNotificationsOverlay.set(false);
  }

  showUserMenu() {
    this.showUserMenuOverlay.set(true);
  }

  closeUserMenu() {
    this.showUserMenuOverlay.set(false);
  }

  setTheme(theme: string) {
    this.settingsThemeFacade.setTheme(theme);
  }

  setLang(lang: string) {
    this.langFacade.setLang(lang);
  }

  setActiveEmployeeId(employeeId: string) {
    this.userState.setActiveEmployeeId(employeeId);
  }

  copyAppVersion() {
    navigator.clipboard.writeText(this.appVersion());
  }

  loadUnreadNotificationsCount() {
    const currentEmployeeId = this.userState.activeEmployeeId();

    this.mainNotificationsService
      .getUnreadNotificationsCount(currentEmployeeId)
      .subscribe(({ unread }) => {
        this.unreadNotificationsCount.set(unread);
      });
  }

  updateUnreadNotificationsCount(readCount: number) {
    this.unreadNotificationsCount.update((count) =>
      Math.max(count - readCount, 0),
    );
  }
}

export type SidebarItem = {
  id: string;
  title: string;
  icon: LucideIconData;
  isActive: boolean;
  link?: string;
  routerLinkActiveOptions?: IsActiveMatchOptions;
  children?: SidebarSubmenuItem[];
  type?: 'normal' | 'bottom';
};

export type SidebarSubmenuItem = {
  id: string;
  title: string;
  link: string;
  isActive: boolean;
};
