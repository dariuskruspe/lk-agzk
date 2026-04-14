import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MainSidebarFacade } from '@features/main/facades/main-sidebar.facade';
import { MainCurrentUserInterface } from '@features/main/models/main-current-user.interface';
import { MainMenuVisibilityService } from '@features/main/services/main-menu-visibility.service';
import { Environment } from '@shared/classes/ennvironment/environment';
import { TranslatePipe } from '@shared/features/lang/pipes/lang.pipe';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { UserSettingsInterface } from '@shared/models/menu-condition.interface';
import { AppService } from '@shared/services/app.service';
import { isNil } from '@shared/utilits/is-nil.util';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-aside-menu',
    templateUrl: './aside-menu.component.html',
    styleUrls: ['./aside-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class AsideMenuComponent implements OnInit, OnChanges, OnDestroy {
  app: AppService = inject(AppService);

  settingsSignal: WritableSignal<SettingsInterface> =
    this.app.storage.settings.data.frontend.signal.globalSettings;

  userSettingsSignal: WritableSignal<UserSettingsInterface> =
    this.app.userSettingsSignal;

  @Input() items: MenuItem[];

  @Input() signLater = false;

  @Input() currentUser: MainCurrentUserInterface;

  @Output()
  itemClick: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();

  menuItems!: MenuItem[];

  hasContent = false;

  private subscriptions: Subscription[] = [];

  private url = this.router.url;

  readonly isMobile = Environment.isMobileApp();

  constructor(
    private readonly router: Router,
    private readonly translatePipe: TranslatePipe,
    private sidebarFacade: MainSidebarFacade,
    private mainMenuVisibilityService: MainMenuVisibilityService,
  ) {}

  static setExpandedProperty(item: MenuItem, url: string): void {
    if (!item.routerLink) {
      return;
    }
    // eslint-disable-next-line no-param-reassign
    item.expanded = url.startsWith(
      typeof item.routerLink === 'string'
        ? item.routerLink
        : item.routerLink.join(''),
    );
  }

  ngOnInit(): void {
    this.checkRoute();
    const sub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((event: NavigationEnd): void => {
        this.url = event.urlAfterRedirects;
        this.checkRoute();
        this.sidebarFacade.setSidebarState(false);
      });
    this.subscriptions.push(sub);
  }

  ngOnChanges(): void {
    if (!this.settingsSignal() || !this.userSettingsSignal()) return;

    if (!isNil(this.currentUser)) {
      this.menuItems = this.mapItems(this.items);
      this.mainMenuVisibilityService.setItems(this.menuItems);
      this.checkRoute();
      this.hasContent = !!this.currentUser;
    }
  }

  toggleItem(item: MenuItem) {
    // eslint-disable-next-line no-param-reassign
    item.expanded = !item.expanded;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private checkRoute(): void {
    this.menuItems?.forEach((item): void =>
      AsideMenuComponent.setExpandedProperty(item, this.url),
    );
  }

  private mapItems(
    items: MenuItem[] | undefined,
    parent?: 'employee' | 'manager' | 'profile',
  ): MenuItem[] | null {
    if (!items || !items.length) return null;
    const childItems: MenuItem[] = [];
    if (parent) {
      childItems.push(
        ...this.getChildItems(parent).map((item) => {
          return {
            label: item.name,
            routerLink: `/custom/${item.id}`,
            icon: item.iconName || 'pi pi-pen-to-square',
            id: item.id,
          };
        }),
      );
    }

    if (childItems.length) {
      childItems.forEach((item) => {
        const settingsItem = this.settingsSignal().custom.find(
          (settingItem) => settingItem.id === item.id,
        );
        const userSettingsItem = this.userSettingsSignal().custom.find(
          (settingItem) => settingItem.id === item.id,
        );
        const alreadyHasItem = items.find(
          (listItem) => listItem.id === item.id,
        );
        if (
          settingsItem &&
          userSettingsItem &&
          settingsItem.enable &&
          userSettingsItem.enable &&
          !alreadyHasItem
        ) {
          items.push(item);
        }
      });
    }

    const a = items
      .filter((item) =>
        item.state?.getVisibility
          ? item.state?.getVisibility({
              settings: this.settingsSignal(),
              signLater: this.signLater,
              currentUser: this.currentUser,
              authType: this.settingsSignal().general.authType !== 'sso',
              userSettings: this.userSettingsSignal(),
            })
          : true,
      )
      .map((item) => ({
        ...item,
        state: {
          // eslint-disable-next-line max-len
          background: `no-repeat bottom right url("${item.state?.mobileIcon}"), no-repeat bottom right var(--menu-bg-url), var(--menu-item-bg)`,
        },
        label:
          this.getLabel(item.nameId) ||
          this.translatePipe.transform(item.label),
        items: this.mapItems(item.items, this.getParentName(item)),
        icon: this.userSettingsSignal()[item.nameId]?.icon || item.icon,
      }))
      .sort((item1: MenuItem, item2: MenuItem) => {
        return (
          (this.userSettingsSignal()[item1.nameId]?.order || 0) -
          (this.userSettingsSignal()[item2.nameId]?.order || 0)
        );
      });
    return a;
  }

  getLabel(id: string): string {
    return this.userSettingsSignal()[id]?.label;
  }

  clickItem(): void {
    this.itemClick.emit();
  }

  navigateMobile(i: MenuItem): void {
    this.router.navigate([i.routerLink]).then(() => {});
    this.clickItem();
  }

  getChildItems(parentName: 'employee' | 'manager' | 'profile') {
    return (
      this.userSettingsSignal()?.custom?.filter(
        (item) => item.parent === parentName,
      ) || []
    );
  }

  getParentName(item: MenuItem): 'employee' | 'manager' | 'profile' {
    switch (item.label) {
      case 'TITLE_GROUP_MANAGER':
        return 'manager';
      case 'TITLE_GROUP_EMPLOYEE':
        return 'employee';
      case 'TITLE_PROFILE':
        return 'profile';
    }
  }
}
