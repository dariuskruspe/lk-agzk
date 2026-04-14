import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  signal,
  SimpleChanges,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { MainNotificationsViewedFacade } from '@features/main/facades/main-notifications-viewed.facade';
import { VacationsGraphDayOffListFacade } from '@features/vacations/facades/vacations-graph-day-off-list.facade';
import { Environment } from '@shared/classes/ennvironment/environment';
import { SettingsThemeFacade } from '@shared/features/settings/facades/settings-theme.facade';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { UserStorageInterface } from '@shared/interfaces/storage/user/user-storage.interface';
import {
  BOOTSTRAP_PARAMS,
  BootstrapParamsInterface,
} from '@shared/models/bootstrap-params.interface';
import { AppService } from '@shared/services/app.service';
import { InitialLoadingService } from '@shared/services/initial-loading.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { UserService } from '@shared/services/user.service';
import { Observable, SubscriptionLike } from 'rxjs';
import { Languages } from '../../constants/languages';
import { Themes } from '../../constants/themes';
import { MainCurrentUserFacade } from '../../facades/main-current-user.facade';
import { MainUserMenuFacade } from '../../facades/main-user-menu-facade';
import { AlertsInterface } from '../../models/alerts.interface';
import { MainCurrentUserInterface } from '../../models/main-current-user.interface';
import { MainNotificationsInterface } from '../../models/main-notifications.interface';
import { NotificationItemInterface } from '../../models/notifications.interface';
import { VacationsScheduleListFacade } from '@features/vacations/facades/vacations-schedule-list.facade';

@Component({
  selector: 'app-main-header-user-menu',
  templateUrl: './main-header-user-menu.component.html',
  styleUrls: ['./main-header-user-menu.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('panelMobile', [
      state(
        'initial',
        style({ width: '100%', transform: 'translate(100%,0)' }),
      ),
      state('expanded', style({ width: '100%', transform: 'translate(0,0)' })),
      transition('initial <=> expanded', [animate('0.15s')]),
    ]),
    trigger('panelTitleMobile', [
      state('initial', style({ width: '*', opacity: 1 })),
      state('expanded', style({ width: '0', opacity: 0 })),
      transition('initial <=> expanded', [animate('0.15s')]),
    ]),
  ],
  standalone: false,
})
export class MainHeaderUserMenuComponent
  implements OnChanges, OnInit, OnDestroy
{
  app: AppService = inject(AppService);

  currentUserStorage: UserStorageInterface = this.app.storage.user.current;

  alertsSignal: WritableSignal<AlertsInterface> =
    this.currentUserStorage.data.frontend.signal.alerts;

  userService: UserService = inject(UserService);

  readonly apiUrl = Environment.inv().api;

  employeeActiveName: string;

  showLanguagesSignal = signal(false);

  openNotifications = false;

  openTheme = false;

  openLogout = false;

  isExpanded = false;

  state = 'initial';

  languages = Languages.slice(0, 6);

  readonly themes = Themes;

  readonly logoutOptions = [
    {
      title: 'QUIT_EMPLDOCS',
      value: true,
    },
    {
      title: 'LOGOUT_USER',
      value: false,
    },
  ];

  @Input() toggleMenu$: Observable<{ type: string; value: boolean }>;

  @Input() employeeId: string;

  @Input() currentUser: MainCurrentUserInterface;

  @Input() set notifications(value: MainNotificationsInterface[]) {
    if (value) {
      this.normalizedNotifications = value
        .map((item) => ({
          id: item.id,
          issueId: item.issueID,
          ownerId: item.OwnerID,
          owner: item.fileOwner,
          message: item.body,
          date: item.date,
          icon: item.iconName,
          title: item.ownerName,
          isViewed: item.isViewed,
          RoleSignatory: item.RoleSignatory,
        }))
        .sort((x, y) => {
          return x.isViewed === y.isViewed ? 0 : x.isViewed ? -1 : 1;
        });
      this.countNotifications = value.filter((item) => !item.isViewed).length;
    }
  }

  @Output() changeEmployee = new EventEmitter<string>();

  @Input() isMobile: boolean;

  @Input() settings: SettingsInterface;

  @Output() logout = new EventEmitter<string>();

  @Output() langChange = new EventEmitter<string>();

  @Output() themeChange = new EventEmitter<string>();

  @Output() deleteNotification = new EventEmitter<string>();

  @Input() pushesLoading = false;

  @Input() pushesAvailable = false;

  @Input() pushesEnabled = false;

  @Output() pushesEnable = new EventEmitter();

  @Output() pushesDisable = new EventEmitter();

  @ViewChild('langPanel') langPanel: ElementRef;

  @ViewChild('themePanel') themePanel: ElementRef;

  @ViewChild('notificationsPanel') notificationsPanel: ElementRef;

  @ViewChild('logoutPanel') logoutPanel: ElementRef;

  normalizedNotifications: NotificationItemInterface[] = [];

  countNotifications: number = 0;

  private toggleSubscription: SubscriptionLike;

  constructor(
    readonly currentUserFacade: MainCurrentUserFacade,
    private userMenuFacade: MainUserMenuFacade,
    public mainNotificationsViewedFacade: MainNotificationsViewedFacade,
    public settingsThemeFacade: SettingsThemeFacade,
    private localstorageService: LocalStorageService,
    private router: Router,
    @Optional()
    @Inject(BOOTSTRAP_PARAMS)
    private params: BootstrapParamsInterface,
    readonly initLoading: InitialLoadingService,
    private daysOffFacade: VacationsGraphDayOffListFacade,
    private scheduleFacade: VacationsScheduleListFacade,
  ) {}

  ngOnChanges({ currentUser, toggleMenu$, settings }: SimpleChanges): void {
    if (currentUser?.currentValue) {
      if (
        currentUser?.currentValue?.employees &&
        currentUser?.currentValue?.employees?.length
      ) {
        if (this.localstorageService.getCurrentEmployeeId()) {
          if (
            currentUser?.currentValue?.employees.findIndex(
              (item) =>
                item.employeeID ===
                this.localstorageService.getCurrentEmployeeId(),
            ) === -1
          ) {
            this.localstorageService.setCurrentEmployeeId(
              currentUser?.currentValue?.employees[0].employeeID,
            );
          }
          this.onCheckedEmployee(
            this.localstorageService.getCurrentEmployeeId(),
          );
        } else {
          this.localstorageService.setCurrentEmployeeId(
            currentUser?.currentValue?.employees[0].employeeID,
          );
          this.onCheckedEmployee(
            currentUser?.currentValue?.employees[0]?.employeeID,
          );
        }
        this.daysOffFacade.show({
          startDate: new Date(new Date().getFullYear() - 2, 0, 1).toISOString(),
          stopDate: new Date(
            new Date().getFullYear() + 2,
            11,
            31,
          ).toISOString(),
        });
        this.scheduleFacade.show({
          dateBegin: new Date(new Date().getFullYear() - 2, 0, 1).toISOString(),
          dateEnd: new Date(new Date().getFullYear() + 2, 11, 31).toISOString(),
        });
      }
    }
    if (toggleMenu$?.currentValue && !this.toggleSubscription) {
      this.toggleSubscription = this.toggleMenu$.subscribe((value) => {
        if (value.value) {
          this.toggleMenu(value.type);
        } else {
          this.closeModal();
        }
      });
    }
    if (settings?.currentValue && settings?.currentValue?.general?.languages) {
      this.languages = Languages.filter((lang) =>
        this.settings.general.languages.includes(lang.value),
      );
    }
  }

  ngOnInit(): void {
    this.userService.initCurrentUserAvatar();
  }

  ngOnDestroy(): void {
    this.toggleSubscription?.unsubscribe();
  }

  @HostListener('document:click', ['$event.target'])
  clickOutside(targetElement: HTMLElement): void {
    const clickedInsideLang =
      this.langPanel.nativeElement.contains(targetElement);
    const clickedInsideTheme =
      this.themePanel.nativeElement.contains(targetElement);
    const clickedNotifications =
      this.notificationsPanel.nativeElement.contains(targetElement);
    const clickedLogout =
      this.logoutPanel.nativeElement.contains(targetElement);
    if (
      !clickedInsideLang &&
      !clickedInsideTheme &&
      !clickedNotifications &&
      !clickedLogout &&
      !this.isMobile
    ) {
      this.closeModal();
    }
  }

  onLogout(userId: string, isQuitEmplDocs?: { value: boolean }): void {
    if (isQuitEmplDocs?.value && this.params?.quit) {
      this.params?.quit();
    } else {
      this.logout.emit(userId);
    }
  }

  onOpenLogout(userId: string): void {
    if (this.params?.quit) {
      this.toggleMenu('openLogout');
    } else {
      this.onLogout(userId);
    }
  }

  changeEmployeeId(id: string): void {
    this.changeEmployee.emit(id);
  }

  onChangeLang(locale: { value: string }): void {
    this.langChange.emit(locale.value);
    this.showLanguagesSignal.set(false);
  }

  onChangeTheme(theme: { value: string }): void {
    this.themeChange.emit(theme.value);
    this.closeModal();
    if (this.isMobile) {
      this.userMenuFacade.setUserMenuState(!this.userMenuFacade.getData());
    }
  }

  onToggleMenu(): void {
    this.isExpanded = !this.isExpanded;
    this.state = this.isExpanded ? 'expanded' : 'initial';
  }

  closeModal(menuItem?: string): void {
    this.showLanguagesSignal.set(false);
    this.openTheme = false;
    this.openNotifications = false;
    this.openLogout = false;
    if (menuItem !== 'menu') {
      this.isExpanded = false;
      this.state = 'initial';
    }
  }

  onCheckedEmployee(id: string | number): void {
    const employee = this.currentUser.employees.find(
      (e) => e.employeeID === id,
    );
    if (employee) {
      this.employeeActiveName = employee.organizationShortName;
    }
  }

  onDeleteNotification(item?: NotificationItemInterface): void {
    if (!item) {
      this.openNotifications = false;
    }
    this.deleteNotification.emit(item?.id);
  }

  openNotification(item: NotificationItemInterface): void {
    this.openNotifications = false;
    if (item.issueId) {
      const section: string[] =
        item.RoleSignatory === 'Сотрудник' || !item.RoleSignatory
          ? ['issues', 'list']
          : ['issues-management'];
      this.router.navigate([...section, item.issueId], {
        queryParams: {
          tab: item.message.toLowerCase().includes('добавлен комментарий')
            ? 'history'
            : 'issue',
        },
      });
    } else if (item.RoleSignatory) {
      switch (item.RoleSignatory) {
        case 'Сотрудник':
          this.router.navigate(['my-documents', item.owner, item.ownerId]);
          break;
        case 'Организация':
          this.router.navigate(['documents', item.owner, item.ownerId]);
          break;
        case 'Руководитель':
          this.router.navigate([
            'documents-employee',
            item.owner,
            item.ownerId,
          ]);
          break;
      }
    }
  }

  setNotificationsViewed(ids: string[]): void {
    if (ids && ids.length) {
      this.normalizedNotifications.forEach((item) => {
        if (ids && ids.includes(item.id)) {
          item.isViewed = true;
        }
      });
      this.countNotifications = this.normalizedNotifications.filter(
        (item) => !item.isViewed,
      ).length;
      this.mainNotificationsViewedFacade.setNotificationsViewed(ids);
    }
  }

  public toggleMenu(menuItem: string): void {
    switch (menuItem) {
      case 'showLanguages':
        this.showLanguagesSignal.update((v: boolean) => !v);
        this.openTheme = false;
        this.openNotifications = false;
        this.openLogout = false;
        break;
      case 'openTheme':
        this.openTheme = !this.openTheme;
        this.openNotifications = false;
        this.showLanguagesSignal.set(false);
        this.openLogout = false;
        break;
      case 'openNotifications':
        this.openNotifications = !this.openNotifications;
        this.openTheme = false;
        this.showLanguagesSignal.set(false);
        this.openLogout = false;
        this.isExpanded = false;
        this.state = 'initial';
        break;
      case 'openLogout':
        this.openLogout = !this.openLogout;
        this.openNotifications = false;
        this.openTheme = false;
        this.showLanguagesSignal.set(false);
        break;
      case 'menu':
        this.closeModal(menuItem);
        this.onToggleMenu();
        break;
      default:
        break;
    }
  }
}
