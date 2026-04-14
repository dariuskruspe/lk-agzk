import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  OnDestroy,
  OnInit,
  runInInjectionContext,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, EventType, Router } from '@angular/router';
import { DocumentDialogContainerComponent } from '@features/agreements/containers/agreements-document-dialog-container/document-dialog-container.component';
import { DocumentListFacade } from '@features/agreements/facades/document-list-facade.service';
import { DocumentStateFacade } from '@features/agreements/facades/document-state-facade.service';
import { UnsignedAgreementsFacade } from '@features/agreements/facades/unsigned-agreements.facade';
import {
  DocumentInterface,
  GetDocumentParamsInterface,
} from '@features/agreements/models/document.interface';
import { EmployeesStateListFacade } from '@features/employees/facades/employees-state-list.facade';
import { EmployeesStaticDataFacade } from '@features/employees/facades/employees-static-data.facade';
import { IssuesStatusListFacade } from '@features/issues/facades/issues-status-list.facade';
import { DefaultDialogComponent } from '@features/main/components/main-menu/default-dialog/default-dialog.component';
import { MainCurrentUserFacade } from '@features/main/facades/main-current-user.facade';
import { MainNotificationsFacade } from '@features/main/facades/main-notifications.facade';
import { MainSidebarFacade } from '@features/main/facades/main-sidebar.facade';
import { MainTemplateFacade } from '@features/main/facades/main-template.facade';
import { MainUserMenuFacade } from '@features/main/facades/main-user-menu-facade';
import { MainEmployeeAlertsService } from '@features/main/services/main-employee-alerts.service';
import { VacationsGraphDayOffListFacade } from '@features/vacations/facades/vacations-graph-day-off-list.facade';
import { VacationsScheduleListFacade } from '@features/vacations/facades/vacations-schedule-list.facade';
import { VacationsTypesFacade } from '@features/vacations/facades/vacations-types.facade';
import { Environment } from '@shared/classes/ennvironment/environment';
import { LangFacade } from '@shared/features/lang/facades/lang.facade';
import { MessagesLangFacade } from '@shared/features/messages-lang/facades/messages-lang.facade';
import { OnboardingHelperService } from '@shared/features/onboarding/services/onboarding-helper.service';
import { PushesService } from '@shared/features/pushes/services/pushes.service';
import { SettingsJivositeFacade } from '@shared/features/settings/facades/settings-jivosite.facade';
import { SettingsThemeFacade } from '@shared/features/settings/facades/settings-theme.facade';
import { SettingsFacade } from '@shared/features/settings/facades/settings.facade';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { ProvidersFacade } from '@shared/features/signature-validation-form/facades/providers.facade';
import { UserStorageInterface } from '@shared/interfaces/storage/user/user-storage.interface';
import { AppService } from '@shared/services/app.service';
import { DeviceService } from '@shared/services/device.service';
import { InitialLoadingService } from '@shared/services/initial-loading.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { UserService } from '@shared/services/user.service';
import { WindowService } from '@shared/services/window.service';
import { SharedStateService } from '@shared/states/shared-state.service';
import { UserStateService } from '@shared/states/user-state.service';
import { isDev } from '@shared/utilits/is-dev';
import { logDebug, logWarn } from '@shared/utilits/logger';
import lottie from 'lottie-web';
import moment from 'moment/moment';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import {
  firstValueFrom,
  mergeMap,
  Observable,
  of,
  Subject,
  Subscription,
} from 'rxjs';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';
import { VacationsInfoDialogComponent } from '@features/vacations/components/vacations-info-dialog/vacations-info-dialog.component';
import { ApiResourceService } from '@app/shared/services/api-resource/api-resource.service';
import { injectResource } from '@app/shared/services/api-resource/utils';
import { IssueTypesResource } from '@app/shared/api-resources/issue-types.resource';
import { MainAnimationResource } from '../../resources/main-animation.resource';
import { CacheStateService } from '@shared/services/cache-state.service';
import { SessionService } from '@shared/services/session.service';
import { SectionSettingsStateService } from '@app/shared/states/section-settings-state.service';
import { GlobalSettingsStateService } from '@app/shared/states/global-settings-state.service';
import { AgreementsStateUtils } from '@features/agreements/utils/agreements-state.utils';
import { MainSidebarService } from '../../services/main-sidebar.service';
import { MenuIcon, PanelLeftIcon } from 'lucide-angular';
import { pick } from 'lodash';
import { SignRoles } from '@app/shared/features/signature-file/models/sign-roles.enum';
import { DocumentApiService } from '@app/features/agreements/services/document-api.service';

@Component({
  selector: 'app-main-template-container',
  templateUrl: './main-template-container.component.html',
  styleUrls: ['./main-template-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
  standalone: false,
})
export class MainTemplateContainerComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  app: AppService = inject(AppService);

  globalSettingsState = inject(GlobalSettingsStateService);

  userState = inject(UserStateService);

  sectionSettingsState = inject(SectionSettingsStateService);

  sharedState = inject(SharedStateService);

  sessionService = inject(SessionService);

  apiResourceService = inject(ApiResourceService);

  sidebar = inject(MainSidebarService);

  issueTypesResource = injectResource(IssueTypesResource).asSignal();

  mainAnimationResource = injectResource(MainAnimationResource);

  currentUserStorage: UserStorageInterface = this.app.storage.user.current;

  settingsStorage = this.app.storage.settings;

  employeeIdSuccess$ = new Subject<boolean>();

  docUnsignedStates: string[];

  notificationInterval;

  private mobileMenuSub: Subscription;

  private destroy$ = new Subject<void>();

  @ViewChild('mainContent') private mainContent: ElementRef;

  @ViewChild('lottie') lottieRef!: ElementRef;

  isPushesEnabled$ = this.pushesService.pushesEnabled$;

  isPushesLoading$ = this.pushesService.pushesLoading$;

  settings = this.globalSettingsState.state;

  isMobile = this.windowService.isMobile;

  readonly PanelLeftIcon = PanelLeftIcon;
  readonly MenuIcon = MenuIcon;

  settings$: Observable<SettingsInterface> = toObservable(this.settings).pipe(
    filter((v: SettingsInterface) => !!v),
    takeUntil(this.destroy$),
  );

  isDashboardPage = toSignal(
    this.router.events.pipe(
      filter((i) => i.type === EventType.NavigationEnd),
      startWith(this.route.firstChild.data),
      mergeMap(() => this.route.firstChild.data),
      map((data) => data.isDashboardPage === true),
    ),
  );

  currentRouteData = toSignal(
    this.router.events.pipe(
      filter((i) => i.type === EventType.NavigationEnd),
      startWith(this.route.firstChild.data),
      mergeMap(() => {
        let { route } = this;
        let data = {};
        while (route.firstChild) {
          route = route.firstChild;
          Object.assign(data, route.snapshot?.data ?? {});
        }
        return of<any>(data);
      }),
    ),
  );

  isFullContent = computed(() => this.currentRouteData()?.fullContent === true);
  isDockyDisabledOnPage = computed(
    () => this.currentRouteData()?.dockyEnabled === false,
  );

  showDocky = computed(
    () =>
      this.settings()?.assistant?.enable !== false &&
      this.showPage() &&
      !this.isDockyDisabledOnPage(),
  );

  showPage = signal(false);

  cssVars = computed(() => {
    const isFullWidth = this.isFullContent();
    const paddingX = isFullWidth ? '0px' : '40px';
    const paddingY = isFullWidth ? '0px' : '24px';

    return {
      '--main-top-offset': this.showDocky() ? '74px' : '16px',
      '--main-left-offset': this.isMobile()
        ? '0px'
        : this.sidebar.isCollapsed()
          ? 'var(--sidebar-width-collapsed)'
          : 'var(--sidebar-width)',
      '--main-padding-x': paddingX,
      '--main-padding-y': paddingY,
    };
  });

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private langFacade: LangFacade,
    public templateFacade: MainTemplateFacade,
    public currentUserFacade: MainCurrentUserFacade,
    private userService: UserService,
    private employeeAlertsService: MainEmployeeAlertsService,
    public employeesStaticDataFacade: EmployeesStaticDataFacade,
    readonly sidebarFacade: MainSidebarFacade,
    readonly userMenuFacade: MainUserMenuFacade,
    public unsignedAgreementsFacade: UnsignedAgreementsFacade,
    private settingsThemeFacade: SettingsThemeFacade,
    public settingsFacade: SettingsFacade,
    public dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute,
    private settingsJivositeFacade: SettingsJivositeFacade,
    public currentUser: MainCurrentUserFacade,
    public agreementDocumentStateFacade: DocumentStateFacade,
    public localStorageService: LocalStorageService,
    public agreementsListFacade: DocumentListFacade,
    public mainNotificationsFacade: MainNotificationsFacade,
    private providersFacade: ProvidersFacade,
    private issueStatusListFacade: IssuesStatusListFacade,
    private vacationTypesFacade: VacationsTypesFacade,
    public employeeStateListFacade: EmployeesStateListFacade,
    private pushesService: PushesService,
    private deviceService: DeviceService,
    private windowService: WindowService,
    private messagesLangFacade: MessagesLangFacade,
    private daysOffFacade: VacationsGraphDayOffListFacade,
    public initialLoadingService: InitialLoadingService,
    private onboardingHelper: OnboardingHelperService,
    private scheduleFacade: VacationsScheduleListFacade,
    private injector: Injector,
    private agreementsStateUtils: AgreementsStateUtils,
    private documentAPI: DocumentApiService,
  ) {
    this.matIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `./assets/img/svg/sprite.svg`,
      ),
    );
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: {
          draft: null,
        },
        queryParamsHandling: 'merge',
      })
      .then(() => {});
    this.initialLoadingService.initWelcomeStatus();

    effect(() => {
      const data = this.agreementDocumentStateFacade.dataSignal();
      const employeeId = this.userState.activeEmployeeId();

      if (data && employeeId) {
        this.initApp();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await Promise.all([this.globalSettingsState.loadOnce()]);

    const settings: SettingsInterface = this.settings();

    if (settings.cache?.enable) {
      this.apiResourceService.enableCache();
      await this.sessionService.fetchCacheChangedTime();
      console.log('cacheChangedTime', this.sessionService.cacheChangedTime());
    }

    // загрузка пользователя
    await this.userState.loadOnce();
    // поддержка легаси
    this.currentUserFacade.getCurrentUser();

    await Promise.all([
      this.sharedState.loadOnce(),
      this.sectionSettingsState.loadOnce(),
    ]);

    this.app.setGlobalSettings(this.globalSettingsState.state());
    this.app.setUserSettings(this.sectionSettingsState.state());

    // Показываем онбординг при каждом обновлении страницы (только в демо-режиме)
    if (settings.general.demoMode) {
      this.onboardingHelper.repeat('welcome'); // HRM-39153
    }

    this.userMenuFacade.setUserMenuState(false);
    this.setMenuState(false);

    this.initJivoSite();
    this.issueStatusListFacade.getIssuesStatusList();
    this.agreementDocumentStateFacade.getState();
    this.providersFacade.show();
    this.vacationTypesFacade.show();
    this.employeeStateListFacade.show();
    this.messagesLangFacade.show();

    await this.employeeAlertsService.alertsHandler();

    this.initialLoadingService.init();

    this.sidebar.loadUnreadNotificationsCount();

    // switch off polling
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.turnPollOff = () => {
      clearInterval(this.employeeAlertsService.alertsInterval);
      clearInterval(this.notificationInterval);
    };
    if (isDev()) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.turnPollOff();
    }
  }

  async ngAfterViewInit(): Promise<void> {
    this.currentLangHandler();

    try {
      const animationData = await this.mainAnimationResource();
      lottie.loadAnimation({
        container: this.lottieRef?.nativeElement,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: animationData,
      });
    } catch (e) {
      logWarn(e, 'error load animations');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
    this.mobileMenuSub?.unsubscribe();
    clearInterval(this.notificationInterval);
    clearInterval(this.employeeAlertsService.alertsInterval);
    if (
      this.settingsFacade?.getData()?.jivosite?.enable &&
      this.settingsFacade?.getData()?.jivosite?.showOnAllPages
    ) {
      this.settingsJivositeFacade.uninstallScript();
    }
  }

  async getCurrentUserHandler(): Promise<void> {
    await this.userState.loadOnce();

    // TODO: убрать, когда избавимся от соответствующих зависимостей, в которых currentUser достаётся при помощи gerx
    this.currentUserFacade.getCurrentUser();
  }

  // Перенесено из ngOnInit
  initJivoSite(): void {
    const settings: SettingsInterface = this.settings();
    if (settings?.jivosite?.enable && settings?.jivosite?.showOnAllPages) {
      this.settingsJivositeFacade.installScript('others');
      this.settingsJivositeFacade.setContactCustomInfo();
    } else {
      this.addJivoSiteSettingsSubscription();
    }
  }

  // Перенесено из ngOnInit
  addJivoSiteSettingsSubscription(): void {
    const jivoSiteSettingsSubscription = this.settings$
      .pipe(
        filter(
          (settings: SettingsInterface) =>
            settings.jivosite?.enable && settings.jivosite?.showOnAllPages,
        ),
      )
      .subscribe((): void => {
        this.settingsJivositeFacade.installScript('others');
        this.settingsJivositeFacade.setContactCustomInfo();
        jivoSiteSettingsSubscription.unsubscribe();
      });
  }

  currentLangHandler() {
    const lang: string = this.langFacade.getLang();
    moment.locale(lang);
    this.langFacade.updateLangSignals(lang);
  }

  async ensureGlobalSettings(): Promise<void> {
    await runInInjectionContext(this.injector, async () => {
      const obs = toObservable(this.settings).pipe(filter((i) => !!i));
      return firstValueFrom(obs);
    });

    logDebug(`global settings:`, this.settings());
  }

  changeEmployeeID(id: string): void {
    this.localStorageService.setCurrentEmployeeId(id);
    window.location.reload();
  }

  getNotifications(): void {
    this.mainNotificationsFacade.getNotifications();
  }

  onDeleteNotification(id: string): void {
    if (id) {
      this.mainNotificationsFacade.deleteNotifications(id);
    } else {
      this.mainNotificationsFacade.deleteNotificationsAll();
    }
  }

  setMenuState(isMobile: boolean): void {
    if (this.sidebarFacade) {
      this.sidebarFacade.setSidebarState(isMobile);
    }
  }

  onLogout(id: string): void {
    const authType = this.localStorageService.getAuthType();
    switch (authType) {
      case 'sso':
        this.templateFacade.logoutUserSso(id);
        break;
      case 'login':
        this.templateFacade.logoutUser(id);
        break;
      default:
        this.templateFacade.logoutUser(id);
        break;
    }

    this.pushesService.disable().then(() => {});
    this.initialLoadingService.setWelcomeStatus(true);
  }

  initApp(): void {
    // todo: жесткий рефакторинг
    const currentEmployeeId = this.userState.activeEmployeeId();
    this.docUnsignedStates = this.agreementsStateUtils.getUnsignedList(
      this.agreementDocumentStateFacade.getData(),
    );
    this.employeesStaticDataFacade.setCurrentEmployeeId(currentEmployeeId);
    this.unsignedAgreementsFacade.getUnsignedDocumentsList(
      this.docUnsignedStates,
    );
    this.scheduleFacade.show({
      dateBegin: new Date(new Date().getFullYear() - 2, 0, 1).toISOString(),
      dateEnd: new Date(new Date().getFullYear() + 2, 11, 31).toISOString(),
    });
    this.setupPushes();

    this.showPage.set(true);

    // todo заменить на webSocket
    //this.getNotifications();

    // т.к. initApp может быть вызван несколько раз, надо чистить предыдущий интервал
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
    }

    this.notificationInterval = setInterval(() => {
      // todo: counter
      this.getNotifications();
    }, 60000);

    if (isDev()) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.turnPollOff();
    }
  }

  changeLang(lang: string): void {
    this.langFacade.setLang(lang);
  }

  themeChange(themeName: string): void {
    this.settingsThemeFacade.setTheme(themeName);
  }

  async showAgreementDialog(agreements: DocumentInterface[]): Promise<void> {
    const updateAgreements = [...agreements];
    const agreement = updateAgreements.shift();
    if (agreement && !agreement.mandatory) {
      // документ подписан, но нужна заявна
      if (
        agreement.settings &&
        agreement.settings.vacationBlockApp &&
        (agreement.settings.vacationConfirmationIsAvailable ||
          agreement.settings.vacationShiftingIsAvailable)
      ) {
        // если после подписания нужно перенести/подтвердить отпуск
        this.openVacationDialog(agreement);
        return;
      } else {
        window.location.reload();
      }
    }

    const docData: DocumentInterface = agreement;
    const docParams: GetDocumentParamsInterface = pick(docData, [
      'id',
      'fileOwner',
      'forEmployee',
    ]) as GetDocumentParamsInterface;
    docParams.role = SignRoles.employee;
    const doc = await firstValueFrom(this.documentAPI.getDocument(docParams));
    const dialogRef = this.dialogService.open(
      DocumentDialogContainerComponent,
      {
        width: '1065px',
        data: {
          document: doc,
          isShowMode: false,
        },
        closable: true,
        dismissableMask: true,
        styleClass: 'show-document',
      },
    );

    const sub = dialogRef?.onClose.subscribe(
      (param?: { signLater?: boolean; forceRedirect?: boolean }) => {
        if (param === undefined && !this.router.url.includes('my-documents')) {
          // если окно с подписание было закрыто без подписания
          this.router.navigate(['/', 'my-documents']).then();
        } else if (
          // после подписания
          param !== undefined &&
          !this.router.url.includes('signature')
        ) {
          if (
            agreement.settings &&
            agreement.settings.vacationBlockApp &&
            (agreement.settings.vacationConfirmationIsAvailable ||
              agreement.settings.vacationShiftingIsAvailable)
          ) {
            // если после подписания нужно перенести/подтвердить отпуск
            this.openVacationDialog(agreement);
          } else {
            window.location.reload();
          }
          return;
        }
        if (!param?.signLater) {
          // если есть еще неподписанные документы
          this.unsignedAgreementsFacade.getUnsignedDocumentsList(
            this.docUnsignedStates,
          );
          if (updateAgreements && updateAgreements.length) {
            this.showAgreementDialog(updateAgreements);
          }
        } else {
          const unsignedState = this.agreementDocumentStateFacade
            .getData()
            .documentsStates.filter((e) => {
              return e.sign === false;
            })
            .map((e) => {
              return e.id;
            });
          this.router.navigate(['/']).then();
          this.router
            .navigate(['/', 'my-documents'], {
              queryParams: { state: unsignedState, mandatory: true },
            })
            .then(() => {
              this.agreementsListFacade.getDocumentList({
                state: unsignedState,
                mandatory: true,
              });
            });
          this.dialogService.open(DefaultDialogComponent, {
            closable: true,
            dismissableMask: true,
          });
        }
        this.router.navigate(['/']).then();
        sub.unsubscribe();
      },
    );
  }

  openVacationDialog(
    agreement: DocumentInterface,
  ): DynamicDialogRef<VacationsInfoDialogComponent> {
    return this.dialogService.open(VacationsInfoDialogComponent, {
      data: {
        vacation: {
          employeeId: this.currentUser.getCurrentEmployee().employeeID,
          subordinated: false,
        },
        period: {
          startDate: agreement.settings.vacationStartDate,
          endDate: agreement.settings.vacationEndDate,
          vacationConfirmationAvailable:
            agreement.settings.vacationConfirmationIsAvailable,
          vacationReshedulingAvailable:
            agreement.settings.vacationShiftingIsAvailable,
          vacationReshedulingAlias: agreement.settings.vacationShiftingAlias,
          vacationTypeId: agreement.settings.vacationTypeID,
        },
        states: { states: [] },
        needReload: true,
      },
      closable: !agreement.settings.vacationBlockApp,
      dismissableMask: false,
      closeOnEscape: false,
    });
  }

  onPushesDisable(): void {
    this.pushesService.disable().then(() => {});
  }

  onPushesEnable(): void {
    this.pushesService.enable().then(() => {});
  }

  private setupPushes() {
    if (this.isPushesAvailable) {
      setTimeout(() => {
        this.pushesService.init().then(() => {});
      }, 1000);
    }
  }

  get isPushesAvailable(): boolean {
    return (
      (this.settings()?.general?.pushNotificationsEnabled || false) &&
      !!Environment.inv().webPushPublicKey &&
      this.deviceService.canUsePushes
    );
  }
}
