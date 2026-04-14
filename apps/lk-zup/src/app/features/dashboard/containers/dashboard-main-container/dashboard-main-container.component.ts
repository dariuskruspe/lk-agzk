import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  Inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { DocumentDialogContainerComponent } from '@features/agreements/containers/agreements-document-dialog-container/document-dialog-container.component';
import { DocumentStateFacade } from '@features/agreements/facades/document-state-facade.service';
import { MyDocumentsListFacade } from '@features/agreements/facades/my-documents-list.facade';
import { DocumentInterface, GetDocumentParamsInterface } from '@features/agreements/models/document.interface';
import {
  DocumentFilterInterface,
  DocumentListInterface,
} from '@features/agreements/models/agreement.interface';
// eslint-disable-next-line max-len
import { toObservable } from '@angular/core/rxjs-interop';
import { DashboardBusinessTripsFacade } from '@features/dashboard/facades/dashboard-business-trips.facade';
import { DashboardCurrentStateFacade } from '@features/dashboard/facades/dashboard-current-state.facade';
import { DashboardPopularRequestsFacade } from '@features/dashboard/facades/dashboard-popular-requests.facade';
import { DashboardSalaryFacade } from '@features/dashboard/facades/dashboard-salary.facade';
import { DashboardVacationImgReportFacade } from '@features/dashboard/facades/dashboard-vacation-img-report.facade';
import { DashboardVacationReportsFacade } from '@features/dashboard/facades/dashboard-vacation-reports.facade';
import { DashboardVacationTotalFacade } from '@features/dashboard/facades/dashboard-vacation-total.facade';
import { DashboardVacationFacade } from '@features/dashboard/facades/dashboard-vacation.facade';
import { DashboardWorkPeriodFacade } from '@features/dashboard/facades/dashboard-work-period.facade';
import { EmployeesStateListFacade } from '@features/employees/facades/employees-state-list.facade';
import { IssuesManagementListDashboardFacade } from '@features/issues-management/facades/issues-management-list-dashboard.facade';
import { IssuesManagementFilterInterface } from '@features/issues-management/models/issues-management-list.interfaces';
import { IssuesAddDialogContainerComponent } from '@features/issues/containers/issues-add-dialog-container/issues-add-dialog-container.component';
import { IssuesShowContainerComponent } from '@features/issues/containers/issues-show-container/issues-show-container.component';
import { IssuesListFacade } from '@features/issues/facades/issues-list.facade';
import { IssuesStatusListFacade } from '@features/issues/facades/issues-status-list.facade';
import { IssuesTypeFacade } from '@features/issues/facades/issues-type.facade';
import { MainCurrentUserFacade } from '@features/main/facades/main-current-user.facade';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '@features/main/utils/breadcrumb-provider.utils';
import { SalariesImgReportFacade } from '@features/salaries/facades/salaries-img-report.facade';
import { VacationsImgReportFacade } from '@features/vacations/facades/vacations-img-report.facade';
import { VacationsTypesFacade } from '@features/vacations/facades/vacations-types.facade';
import { Environment } from '@shared/classes/ennvironment/environment';
import { LangFacade } from '@shared/features/lang/facades/lang.facade';
import { TranslatePipe } from '@shared/features/lang/pipes/lang.pipe';
import { MessageSnackbarService } from '@shared/features/message-snackbar/message-snackbar.service';
import { MessageType } from '@shared/features/message-snackbar/models/message-type.enum';
import { ReportDialogContainerComponent } from '@shared/features/report-dialog/containers/report-dialog-container/report-dialog-container.component';
import { SettingsThemeFacade } from '@shared/features/settings/facades/settings-theme.facade';
import { SettingsFacade } from '@shared/features/settings/facades/settings.facade';
import { UserSettingsFacade } from '@shared/features/settings/facades/user-settings.facade';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { UserSettingsInterface } from '@shared/models/menu-condition.interface';
import { AppService } from '@shared/services/app.service';
import { InitialLoadingService } from '@shared/services/initial-loading.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import {
  Preloader,
  providePreloader,
} from '@shared/services/preloader.service';
import { logDebug } from '@shared/utilits/logger';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  GridItemHTMLElement,
  GridStackNode,
  GridStackOptions,
  GridStackWidget,
} from 'gridstack';
// eslint-disable-next-line import/no-extraneous-dependencies
import { elementCB, GridstackComponent, nodesCB } from 'gridstack/dist/angular';
// eslint-disable-next-line import/no-extraneous-dependencies
import { GridStackPosition } from 'gridstack/dist/types';
import { isNil, pick } from 'lodash';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProgressBar } from 'primeng/progressbar';
import { firstValueFrom, Subject, Subscription } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { DashboardCustomWidgetsInterface } from '../../models/dashboard-custom-widgets.interfac';
import { DashboardCustomWidgetsDialogComponent } from '../../components/dashboard-cutom-widgets-dialog/dashboard-cutom-widgets-dialog.component';
import { SupportHelpMainInterface } from '@app/features/support/models/support-help.interface';
import { DashboardCustomWidgetsService } from '../../services/dashboard-custom-widgets.service';
import { SignRoles } from '@app/shared/features/signature-file/models/sign-roles.enum';
import { DocumentApiService } from '@app/features/agreements/services/document-api.service';

@Component({
    selector: 'app-dashboard-main-container',
    templateUrl: './dashboard-main-container.component.html',
    styleUrls: ['./dashboard-main-container.component.scss'],
    providers: [
        providePreloader(ProgressBar),
        provideBreadcrumb('BREADCRUMBS_DASHBOARD', 0),
    ],
    standalone: false
})
export class DashboardMainContainerComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  app: AppService = inject(AppService);

  screenSizeData = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSizeData.signal.isMobileV;

  isMobileV$ = toObservable(this.isMobileV);

  subscription: Subscription = new Subscription();

  public gridOptions: GridStackOptions = {
    margin: 10,
    column: 2, // 2-колоночный макет
    // float: true,
    minRow: 1,
    cellHeight: 10,
    sizeToContent: true, // подгонять размеры виджетов по их содержимому
    resizable: {
      handles: 'e,w',
    },
    disableDrag: true,
    disableResize: true,
    // columnOpts: { breakpoints: [{ w: 768, c: 1 }] },
  };

  // Режим редактирования (перетаскивания + изменения размеров) виджетов
  public isEditable: boolean = false;

  // TODO: изменить стили таким образом, чтобы карточка внутри виджета занимала всю высоту контейнера, и затем можно будет скрыть border виджета
  // 12-колоночный макет (по умолчанию), значения h подобраны для сетки с фиксированным заданием высоты (h) виджетов
  // (sizeToContent: false) при высоте ячейки сетки в 10px (cellHeight: 10)
  // public defaultGrid: GridStackWidget[] = [
  //   { id: 'work-status', x: 0, y: 0, w: 6, h: 32 },
  //   { id: 'popular-requests', x: 7, y: 0, w: 6, h: 32 },
  //   { id: 'my-documents', x: 0, y: 0, w: 6, h: 42 },
  //   { id: 'my-applications', x: 7, y: 0, w: 6, h: 42 },
  //   { id: 'business-trips', x: 0, y: 0, w: 12, h: 25 },
  //   { id: 'vacations', x: 0, y: 0, w: 12, h: 42 },
  //   { id: 'salary', x: 0, y: 0, w: 12, h: 22 },
  //   { id: 'vacation-reports', x: 0, y: 0, w: 12, h: 106 },
  // ];

  // 2-колоночный макет (column: 2 в gridOptions), автоматически вычисленные значения высоты (h) и координаты по оси y
  // (y) виджетов — взяты из реальной сетки с автоматическим вычислением высоты виджетов по их содержимому
  // (sizeToContent: true) при высоте ячейки сетки в 10px (cellHeight: 10)
  public defaultGrid: GridStackWidget[] = [
    { id: 'work-status', x: 0, y: 0, w: 1, h: 30 },
    { id: 'popular-requests', x: 1, y: 0, w: 1, h: 30 },
    { id: 'my-documents', x: 0, y: 30, w: 1, h: 38 },
    { id: 'my-approvals', x: 1, y: 30, w: 1, h: 38 },
    { id: 'my-applications', x: 0, y: 68, w: 2, h: 54 },
    { id: 'business-trips', x: 0, y: 122, w: 2, h: 23 },
    { id: 'vacation-balances', x: 0, y: 145, w: 2, h: 30 },
    { id: 'my-vacation-schedule', x: 0, y: 175, w: 2, h: 50 },
    { id: 'salary', x: 0, y: 225, w: 2, h: 20 },
    { id: 'custom-reports', x: 0, y: 245, w: 2, h: 124 },
    { id: 'custom-widgets', x: 0, y: 245, w: 2, h: 124 },
  ];


  widgets: WritableSignal<DashboardCustomWidgetsInterface[]> = signal([]);

  widgetsRequested: WritableSignal<boolean> = signal(false);

  widgetsLoading: WritableSignal<boolean> = signal(false);

  public grid: GridStackWidget[] = structuredClone(this.defaultGrid);

  public isGridReadySignal = signal(false);

  dataList: DocumentListInterface;

  private destroy$ = new Subject<void>();

  isNativeMobile = Environment.isMobileApp();

  private bufferedRequest = {
    managerIssues: null,
    issues: null,
    documents: null,
  };

  isDataLoadedSignal: WritableSignal<boolean> = signal(false);

  settingsSignal: WritableSignal<SettingsInterface> =
    this.app.storage.settings.data.frontend.signal.globalSettings;

  userSettingsSignal: WritableSignal<UserSettingsInterface> =
    this.app.userSettingsSignal;

  @ViewChild(GridstackComponent) gridComp?: GridstackComponent;

  constructor(
    public currentStateFacade: DashboardCurrentStateFacade,
    public popularRequestsFacade: DashboardPopularRequestsFacade,
    public vacationFacade: DashboardVacationFacade,
    public issuesListFacade: IssuesListFacade,
    public vacationTotalFacade: DashboardVacationTotalFacade,
    public salaryFacade: DashboardSalaryFacade,
    public workPeriodFacade: DashboardWorkPeriodFacade,
    public issuesStatusListFacade: IssuesStatusListFacade,
    public dialogService: DialogService,
    public langFacade: LangFacade,
    private localStorageService: LocalStorageService,
    public currentUser: MainCurrentUserFacade,
    public settingsFacade: SettingsFacade,
    public myDocumentsListFacade: MyDocumentsListFacade,
    public dashboardBusinessTripsFacade: DashboardBusinessTripsFacade,
    public agreementDocumentStateFacade: DocumentStateFacade,
    public issuesManagementListFacade: IssuesManagementListDashboardFacade,
    private vacationReportFacade: VacationsImgReportFacade,
    private salaryReportFacade: SalariesImgReportFacade,
    private userSettingsFacade: UserSettingsFacade,
    private preloader: Preloader,
    private toastService: MessageSnackbarService,
    private translatePipe: TranslatePipe,
    public vacationTypeFacade: VacationsTypesFacade,
    public issueTypeFacade: IssuesTypeFacade,
    public employeeStateListFacade: EmployeesStateListFacade,
    public settingsThemeFacade: SettingsThemeFacade,
    public vacationReportsFacade: DashboardVacationReportsFacade,
    private dashboardVacationImgReportFacade: DashboardVacationImgReportFacade,
    @Inject(BREADCRUMB) private _: unknown,
    public initLoadingService: InitialLoadingService,
    public customWidgetsService: DashboardCustomWidgetsService,
    private ref: ChangeDetectorRef,
    private documentAPI: DocumentApiService,
  ) {}

  ngOnInit(): void {
    this.preloader.setCondition(
      this.currentStateFacade.forcedLoading$,
      this.issuesListFacade.forcedLoading$,
      this.popularRequestsFacade.forcedLoading$,
      this.issuesStatusListFacade.forcedLoading$,
      this.dashboardBusinessTripsFacade.forcedLoading$,
      this.issuesManagementListFacade.forcedLoading$,
      this.myDocumentsListFacade.forcedLoading$,
      this.agreementDocumentStateFacade.forcedLoading$,
      this.currentUser.forcedLoading$,
    );

    this.preloader.loading$
      .pipe(
        filter((v) => !v),
        takeUntil(this.destroy$),
      )
      .subscribe((): void => {
        this.isDataLoadedSignal.set(true);

        // ждём пару-тройку секунд после получения данных, чтобы сетка успела отрисоваться: @if(isDataLoaded) в шаблоне
        setTimeout(() => {
          // подгоняем размеры виджетов под размеры их содержимого
          this.resizeWidgetsToFitContent();
        }, 3500);
      });

    this.addSubscriptions();
  }

  addSubscriptions(): void {
    this.addIsMobileVSubscription();
  }

  addIsMobileVSubscription(): void {
    this.subscription.add(
      this.isMobileV$.subscribe((): void => {
        this.loadGridHandler();
      }),
    );
  }

  async ngAfterViewInit(): Promise<void> {
    this.initDashboard();
    this.currentStateFacade.getCurrentState();
    this.popularRequestsFacade.getPopularRequests();
    this.vacationFacade.getVacations();
    this.vacationTotalFacade.getTotalDays();
    this.workPeriodFacade.getWorkPeriods();
    this.issuesListFacade.getList({ count: 5, page: 1 });
    this.vacationReportsFacade.getReports();
    this.bufferedRequest.issues = this.issuesListFacade.getList.bind(
      this.issuesListFacade,
    );
    this.dashboardBusinessTripsFacade.getBusinessTrips();
  }

  /**
   * Инициализируем дэшборд (рабочий стол) с виджетами пользователя.
   *
   * (!) Важно: инициализация представления дэшборда в шаблоне компонента должна происходить только после загрузки всех
   * необходимых данных, отображаемых в виджетах, иначе некоторые виджеты могут наложиться поверх других.
   */
  initDashboard(): void {
    this.initGridstackDashboard();
  }

  initGridstackDashboard(): void {
    this.grid = this.getGridLayout();
    this.isGridReadySignal.set(true);
  }

  /**
   * Получаем текущую структуру макета сетки виджетов в виде массива объектов GridStackWidget.
   */
  private getGridLayout(): GridStackWidget[] {
    const dashboardKey: string = this.getDashboardKey();

    const gridStackOptions: GridStackOptions =
      JSON.parse(localStorage.getItem(dashboardKey)) ||
      structuredClone(this.gridOptions);

    let layout: GridStackWidget[] =
      gridStackOptions?.children || structuredClone(this.defaultGrid);

    layout = layout.filter((w: GridStackWidget) => this.isWidgetEnabled(w));

    if (this.isMobileV()) {
      // растягиваем виджеты на всю ширину строки сетки
      for (const widget of layout) {
        widget.w = 2; // grid columns count
      }
    } else {
      const rows: GridStackWidget[][] = this.getRowsByGridLayout(layout);

      // если в строке только 1 виджет, то растягиваем его на всю ширину строки сетки
      for (const row of rows) {
        if (row.length === 1) {
          const widget: GridStackWidget = row[0];
          widget.w = 2; // grid columns count
        }
      }
    }

    return layout;
  }

  public saveGrid(): void {
    const options: GridStackOptions =
      (this.gridComp?.grid?.save(false, true) as GridStackOptions) ||
      structuredClone(this.gridOptions); // grid.save(false, true) -> no content, full options

    if (!options.children) options.children = structuredClone(this.defaultGrid);

    // (!) Дефолтная функция сохранения сетки (gridComp.grid.save) на момент написания кода работает некорректно:
    // по какой-то причине появляются отрицательные значения для координат y, поэтому добавил ручное обновление
    // значений свойств, отвечающих за положение и размеры виджетов. Эти значения берутся из соответствующих нод
    // (this.gridComp.grid.engine.nodes).

    const { nodes } = this.gridComp.grid.engine;
    const position: GridStackPosition = { x: 0, y: 0, w: 0, h: 0 };

    for (const widget of options.children) {
      const matchedNode: GridStackNode = nodes.find(
        (n: GridStackNode): boolean => n.id === widget.id,
      );
      for (const key in position) {
        widget[key] = matchedNode[key];
      }
    }

    const dashboardKey: string = this.getDashboardKey();
    localStorage.setItem(dashboardKey, JSON.stringify(options));
  }

  public loadGrid(layout: GridStackWidget[]): void {
    if (!this.gridComp?.grid) return;
    this.gridComp.grid.load(layout);
  }

  private loadGridHandler(): void {
    const layout: GridStackWidget[] = this.getGridLayout();
    this.loadGrid(layout);
  }

  getWidgetById(id: string): GridStackWidget {
    if (!this.grid?.length) return null;
    return this.grid.find((item: GridStackWidget): boolean => item.id === id);
  }

  onChange(): void {
    if (!this.isDataLoadedSignal()) return;
    // logDebug(`[gridstack] onChange -> $event`, $event);
  }

  onDragStop($event: elementCB): void {
    if (!this.isDataLoadedSignal()) return;
    logDebug(`[gridstack] onDragStop -> $event`, $event);
    this.saveGrid();
  }

  onResizeStop($event: elementCB): void {
    logDebug(`[gridstack] onResizeStop -> $event`, $event);
    this.saveGrid();

    // HRM-40470 (см. комментарии) перезагружаем ("перерисовываем") сетку,
    // чтобы применить необходимые корректировки (например, растянуть единственные виджеты
    // в некоторых строках на всю ширину таковых строк)
    // this.loadGridHandler(); // закомментил по причине того,
    // что нам заранее неизвестно намерение пользователя: он может уменьшить ширину виджета
    // просто для того, чтобы на образовавшееся пустое пространство перетащить другой подходящий виджет
  }

  toggleEditMode(): void {
    this.isEditable = !this.isEditable;
    this.gridComp.grid.enableMove(this.isEditable);
    this.gridComp.grid.enableResize(this.isEditable);

    if (this.isEditable) {
      this.toastService.show(
        this.translatePipe.transform('DASHBOARD_EDIT_MODE_HINT'),
        MessageType.info,
        15000,
      );
    }
  }

  resetGrid(): void {
    const dashboardKey: string = this.getDashboardKey();
    localStorage.removeItem(dashboardKey);
    const layout: GridStackWidget[] = this.getGridLayout();
    this.loadGrid(layout);
    this.saveGrid();
  }

  openIssueShowDialog(id: string): void {
    const dialog = this.dialogService.open(IssuesShowContainerComponent, {
      width: '1065px',
      data: { issueId: id },
      closable: true,
      dismissableMask: true,
    });
    this.updateAfterDialog(
      dialog,
      this.bufferedRequest.issues,
      this.bufferedRequest.managerIssues,
    );
  }

  openIssueShowDialogApprove(id: string): void {
    const dialog = this.dialogService.open(IssuesShowContainerComponent, {
      width: '1065px',
      data: { issueId: id },
      closable: true,
      dismissableMask: true,
    });
    this.updateAfterDialogNoResult(dialog, this.bufferedRequest.managerIssues);
  }

  onGetAgreementsList(filterData: DocumentFilterInterface): void {
    const filterValue: DocumentFilterInterface = filterData;
    filterValue.searchTarget = ['name'];
    this.myDocumentsListFacade.getDocumentList(filterValue);
    this.bufferedRequest.documents =
      this.myDocumentsListFacade.getDocumentList.bind(
        this.myDocumentsListFacade,
        filterValue,
      );
  }

  getIssuesManagementList(filterData?: IssuesManagementFilterInterface): void {
    this.issuesManagementListFacade.getIssuesManagementList(filterData);
    this.bufferedRequest.managerIssues =
      this.issuesManagementListFacade.getIssuesManagementList.bind(
        this.issuesManagementListFacade,
        filterData,
      );
  }

  openVacationImgDialog(date: string): void {
    this.dialogService.open(ReportDialogContainerComponent, {
      width: '1065px',
      data: {
        params: { date },
        facade: this.vacationReportFacade,
      },
      closable: true,
      dismissableMask: true,
    });
  }

  openSalaryImgDialog(date: string): void {
    this.dialogService.open(ReportDialogContainerComponent, {
      width: '1065px',
      data: {
        params: { date },
        facade: this.salaryReportFacade,
      },
      closable: true,
      dismissableMask: true,
    });
  }

  openIssueAddDialog(data: { alias: string; formData: unknown }): void {
    this.dialogService.open(IssuesAddDialogContainerComponent, {
      width: '1065px',
      data,
      closable: true,
    });
  }

  workPeriodDateUpdate(data: string): void {
    this.salaryFacade.getSalary(data);
  }

  vacationBalanceDateUpdate(date: Date): void {
    this.vacationTotalFacade.getTotalDaysDate(new Date(date).toISOString());
  }

  async openDocumentDialog(doc: DocumentInterface): Promise<void> {
    const docData: DocumentInterface = doc;
    const docParams: GetDocumentParamsInterface = pick(docData, ['id', 'fileOwner', 'forEmployee']) as GetDocumentParamsInterface;
      docParams.role = SignRoles.employee;
    const fullDoc = await firstValueFrom(this.documentAPI.getDocument(docParams));
    const dialog = this.dialogService.open(DocumentDialogContainerComponent, {
      width: '1065px',
      data: {
        document: fullDoc,
        isShowMode: false,
      },
      closable: true,
      dismissableMask: true,
      styleClass: 'show-document',
    });
    this.updateAfterDialog(dialog, this.bufferedRequest.documents);
  }

  isWidgetEnabled(widget: GridStackWidget): boolean {
    const userSettings: UserSettingsInterface = this.userSettingsSignal();

    if (!userSettings) return false;

    return this.isWidgetByIdEnabled(widget.id);
  }

  getWidgetNameById(id: string): string {
    const widgetNamesByIds: Record<string, string> = {
      'work-status': 'dashboard_status',
      'popular-requests': 'dashboard_status',
      'my-documents': 'dashboard_documents',
      'my-approvals': 'dashboard_employeeRequests',
      'my-applications': 'dashboard_requests',
      'business-trips': 'dashboard_businessTrips',
      'vacation-balances': 'dashboard_vacations',
      'my-vacation-schedule': 'dashboard_vacations',
      salary: 'dashboard_payroll',
      'custom-reports': 'dashboard_customReports',
      'custom-widgets': 'custom-widgets',
    };

    return widgetNamesByIds[id];
  }

  isWidgetByIdEnabled(id: string): boolean {
    if (id === 'popular-requests') return true; // для виджета "Популярные заявки" ещё нет настройки вкл/выкл
    if (id === 'my-documents') {
      if (!this.settingsSignal()?.myDocuments?.enable) return false; // для виджета "Мои документы" есть ещё глобальная настройка
    }
    if (id === 'custom-widgets') {
      if (!this.userSettingsSignal().dashboard.hasCustomWidgets) {
        return false;
       } else {
        if (!this.widgetsRequested() && !this.widgetsLoading()) {
          this.widgetsRequested.set(true);
          this.widgetsLoading.set(true);
          this.getCustomWidgets();
          this.ref.detectChanges();
          return true;
       }
      }
      return true;
    }

    const widgetName: string = this.getWidgetNameById(id);
    return this.isWidgetByNameEnabled(widgetName);
  }

  isWidgetByNameEnabled(widgetName: string): boolean {
    const settings: SettingsInterface = this.settingsSignal();
    const userSettings: UserSettingsInterface = this.userSettingsSignal();
    if (!userSettings) return false;

    const isUserSettingExists: boolean = !isNil(
      userSettings?.dashboard[widgetName]?.enable,
    );
    const isUserSettingEnabled: boolean = Boolean(
      userSettings?.dashboard[widgetName]?.enable,
    );

    // Виджет "Зарплата"
    if (widgetName === 'dashboard_payroll') {
      const isSettingExists: boolean = !isNil(
        settings.dashboard?.payroll?.enable,
      );
      const isSettingEnabled: boolean = Boolean(
        settings.dashboard?.payroll?.enable,
      );

      return (
        (isSettingExists ? isSettingEnabled : true) &&
        (isUserSettingExists ? isUserSettingEnabled : true)
      );
    }

    return isUserSettingExists ? isUserSettingEnabled : true;
  }

  getCustomWidgets(): void {
    this.customWidgetsService.getCustomWidgets().subscribe((widgets) => {
      this.widgets.set(widgets.filter((widget) => widget.display).sort((a, b) => a.order - b.order));
      this.widgetsLoading.set(false);
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
    this.subscription.unsubscribe();
  }

  private updateAfterDialog(
    dialog: DynamicDialogRef,
    ...fetchFunctions: Array<() => void>
  ): void {
    dialog.onClose
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          fetchFunctions.forEach((func) => func());
        }
      });
  }

  private updateAfterDialogNoResult(
    dialog: DynamicDialogRef,
    ...fetchFunctions: Array<() => void>
  ): void {
    dialog.onClose.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
      fetchFunctions.forEach((func) => func());
    });
  }

  openVacationReportDialog(data: {
    dateBegin: string;
    dateEnd: string;
    reportId: string;
    formats: string[];
  }): void {
    this.dialogService.open(ReportDialogContainerComponent, {
      width: '1065px',
      data: {
        params: { ...data },
        facade: this.dashboardVacationImgReportFacade,
      },
      closable: true,
      dismissableMask: true,
    });
  }

  private resizeWidgetsToFitContent(): void {
    if (!this.gridComp?.grid) return;
    logDebug('[resizeWidgetsToFitContent]');

    const gridItems: GridItemHTMLElement[] = this.gridComp.grid.getGridItems();

    for (const gridItem of gridItems) {
      this.gridComp.grid.resizeToContent(gridItem);
    }
  }

  /**
   * Группируем виджеты из макета сетки по строкам.
   *
   * @param {GridStackWidget[]} layout массив виджетов (объектов GridStackWidget), представляющий текущую структуру
   * макета сетки виджетов.
   * @returns {GridStackWidget[][]} массив массивов виджетов, где каждый внутренний массив содержит виджеты одной
   * строки.
   */
  private getRowsByGridLayout(layout: GridStackWidget[]): GridStackWidget[][] {
    if (!layout) return [];
    const rows: GridStackWidget[][] = layout.reduce(
      (acc: GridStackWidget[][], widget) => {
        const matchedRow = acc.find((r) => r.some((w) => w.y === widget.y));
        if (!matchedRow) acc.push([widget]);
        else matchedRow.push(widget);
        return acc;
      },
      [],
    );

    return rows;
  }

  /**
   * Получаем ключ для хранения настроек виджетов в localStorage.
   */
  getDashboardKey(): string {
    const apiURL: string = Environment.inv().api;
    const currentEmployeeId: string =
      this.localStorageService.getCurrentEmployeeId();

    if (!apiURL || !currentEmployeeId) return 'dashboard';

    // разделитель для частей ключа
    const separator: string = ' -^_^- ';

    return ['dashboard', currentEmployeeId, apiURL].join(separator);
  }

  async openCustomWidgetDialog(data: {
    date: string;
    id: string;
    content: SupportHelpMainInterface;
    hidePeriodSelection: boolean;
    template: string;
  }) {
    this.widgetsLoading.set(true);
    let content: SupportHelpMainInterface;
    let template: string;
    if (data.hidePeriodSelection) {
      content = data.content
      template = data.template;
    } else {
      const widgets = await firstValueFrom(this.customWidgetsService.getCustomWidgetById(data.id, data.date));
      const widget = widgets.find((widget) => widget.id === data.id);
      content = widget.markup ? { title: widget.title, markup: widget.markup } : null;
      template = widget.template;
    }
    this.widgetsLoading.set(false);
    this.dialogService.open(DashboardCustomWidgetsDialogComponent, {
      data: { content, template },
    });
  }
}
