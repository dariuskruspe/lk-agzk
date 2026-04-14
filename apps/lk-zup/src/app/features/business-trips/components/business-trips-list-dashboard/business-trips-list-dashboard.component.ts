import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessTripsInfoDialogComponent } from '@features/business-trips/components/business-trips-info-dialog/business-trips-info-dialog.component';
import {
  BUSINESS_TRIP_DATA_CONFIG,
  BUSINESS_TRIP_ITEM_LAYOUT,
  BusinessTripsMemberListItem,
} from '@features/business-trips/constants/business-trip-data-config';
import { BusinessTripsFilterValueInterface } from '@features/business-trips/interfaces/business-trips-filter-value.interface';
import {
  IssuesTypesInterface,
  IssueTypeGroups,
} from '@features/issues/models/issues-types.interface';
import {
  IssuesListInterface,
  IssuesStatusInterface,
} from '@features/issues/models/issues.interface';
import { MainCurrentUserInterface } from '@features/main/models/main-current-user.interface';
import { VacationsInfoDialogComponent } from '@features/vacations/components/vacations-info-dialog/vacations-info-dialog.component';
import { VacationsGraphDayOffListFacade } from '@features/vacations/facades/vacations-graph-day-off-list.facade';
import { VacationsGraphFilterInterface } from '@features/vacations/models/vacations-graph-filter.interface';
import { VacationsStatesInterface } from '@features/vacations/models/vacations-states.interface';
import {
  VacationPeriodInterface,
  VacationsInterface,
} from '@features/vacations/models/vacations.interface';
import { ItemListBuilderInterface } from '@shared/components/item-list-builder/models/item-list-builder.interface';
import { WorkStatusInterface } from '@shared/features/calendar-graph/models/calendar-graph-member-list.interface';
import { VacationScheduleService } from '@shared/features/calendar-graph/services/vacation-schedule.service';
import { CalendarGraphInterface } from '@shared/features/calendar-graph/models/calendar-graph.interface';
import { EmployeeVacationsService } from '@shared/features/calendar-graph/services/employee-vacations.service';
import { LangFacade } from '@shared/features/lang/facades/lang.facade';
import { TranslatePipe } from '@shared/features/lang/pipes/lang.pipe';
import { LangUtils } from '@shared/features/lang/utils/lang.utils';
import { SettingsFacade } from '@shared/features/settings/facades/settings.facade';
import { FileBase64 } from '@shared/models/files.interface';
import { AppService } from '@shared/services/app.service';
import {
  GetReportParamsInterface,
  ReportApiService,
} from '@shared/services/api/report-api.service';
import { FileDownloadService } from '@shared/services/file-download.service';
import { FileSanitizerClass } from '@shared/utilits/download-file.utils';
import { logDebug } from '@shared/utilits/logger';
import {
  beginningOfMonth,
  beginningOfYear,
  endOfMonth,
  endOfYear,
} from '@shared/utils/datetime/common';
import {
  FpcInputsInterface,
  FpcInterface,
  FpcOptionListItemInterface,
} from '@wafpc/base/models/fpc.interface';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { firstValueFrom } from 'rxjs';
import { BusinessTripsTimesheetFacade } from '@features/business-trips/facades/business-trips-timesheet.facade';

@Component({
    selector: 'app-business-trips-list-dashboard',
    templateUrl: './business-trips-list-dashboard.component.html',
    styleUrls: ['./business-trips-list-dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class BusinessTripsListDashboardComponent
  implements OnChanges, OnInit, AfterViewInit
{
  app = inject(AppService);

  employeeVacationsService: EmployeeVacationsService = inject(
    EmployeeVacationsService,
  );

  vacationScheduleService: VacationScheduleService = inject(
    VacationScheduleService,
  );

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  daysValueList: FpcOptionListItemInterface[] = [
    {
      title: this.langUtils.convert(
        this.langFacade.getLang(),
        'SELECT_PERIOD_VALUE_1',
      ),
      value: '1',
    },
    {
      title: this.langUtils.convert(
        this.langFacade.getLang(),
        'SELECT_PERIOD_VALUE_3',
      ),
      value: '3',
    },
    {
      title: this.langUtils.convert(
        this.langFacade.getLang(),
        'SELECT_PERIOD_VALUE_10',
      ),
      value: '10',
    },
    {
      title: this.langUtils.convert(
        this.langFacade.getLang(),
        'SELECT_PERIOD_VALUE_30',
      ),
      value: '30',
    },
    {
      title: this.langUtils.convert(
        this.langFacade.getLang(),
        'SELECT_PERIOD_VALUE_90',
      ),
      value: '90',
    },
    {
      title: this.langUtils.convert(
        this.langFacade.getLang(),
        'SELECT_PERIOD_VALUE_360',
      ),
      value: '360',
    },
  ];

  issueTypeGroups: IssueTypeGroups[];

  filterInputs: FpcInputsInterface[] = [
    {
      type: 'text',
      formControlName: 'search',
      label: this.langUtils.convert(
        this.langFacade.getLang(),
        'SEARCH_BY_BUSINESS_TRIPS',
      ),
      placeholder: '',
      gridClasses: ['col-lg-9', 'com-md-12'],
      validations: [],
      icon: { name: 'clear', clearMode: true },
      edited: true,
    },

    {
      type: 'select',
      formControlName: 'days',
      label: this.langUtils.convert(this.langFacade.getLang(), 'PERIOD'),
      gridClasses: ['col-lg-3', 'com-md-12'],
      validations: [],
      edited: true,
      selectMultiple: false,
      optionList: this.daysValueList,
    },
  ];

  filterConfig: FpcInterface = {
    options: {
      changeStrategy: 'push',
      appearanceElements: 'outline',
      editMode: true,
      viewMode: 'edit',
      submitDebounceTime: 1000,
    },
    template: this.filterInputs,
  };

  dataConfig: ItemListBuilderInterface[] = BUSINESS_TRIP_DATA_CONFIG;

  dataLayout = BUSINESS_TRIP_ITEM_LAYOUT;

  scrollContainerClassCss = '.scroll-main-container';

  @Input() issuesTypeList: IssuesTypesInterface;

  @Input() businessTripsList: IssuesListInterface;

  @Input() businessTripsStatusList: IssuesStatusInterface;

  @Input() loading: boolean;

  @Input() showIssuesList: boolean;

  @Input() scrollPosition: number;

  @Input() sectionId: 'employeeBusinessTrips' | 'businessTrips';

  @Input() members: { members: BusinessTripsMemberListItem[] };

  @Input() types: WorkStatusInterface[];

  @Input() businessTripsPeriod: VacationsInterface[];

  @Input() currentUser: MainCurrentUserInterface;

  @Output() saveScrollPosition = new EventEmitter();

  @Output() loadList = new EventEmitter();

  @Output() goDetails = new EventEmitter();

  @Output() goToIssueCreation = new EventEmitter();

  @Output() changeYearFilter = new EventEmitter<number>();

  filterValues: VacationsGraphFilterInterface = {
    date: new Date().getFullYear(),
    endDate: new Date().toISOString(),
    employees: [],
    showType: 'month',
    requiringApproval: false,
    hasIntersection: false,
    month: new Date().toLocaleString('default', { month: 'long' }),
  };

  bufferedFilterValue: {
    employees: { title: string; value: string }[];
    showType: 'month' | 'year';
    hasReport: boolean;
  } = {
    employees: [],
    showType: 'month',
    hasReport: false,
  };

  months: string[] = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
  ];

  year: number = new Date().getFullYear();

  calendarConfig: CalendarGraphInterface = {
    date: new Date(new Date().getFullYear(), 0, 1).toISOString(),
    endDate: new Date(new Date().getFullYear(), 11, 31).toISOString(),
    graphType: 'schedule',
    managementMode: true,
    membersShow: true,
    showDaysOff: true,
    showType: 'month',
    showWorkTime: false,
  };

  states: VacationsStatesInterface = {
    states: [],
  };

  chosenBusinessTrips: VacationsInterface[] = [];

  daysOfWeek: string[] = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ];

  employeeList: {
    title: string;
    value: boolean;
    checked: boolean;
    items: { title: string; value: string }[];
  }[] = [];

  searchTextCopy;

  showFilters = false;

  timeoutId;

  statusList = [];

  filterValue: BusinessTripsFilterValueInterface = {
    count: 15,
    page: 1,
    days: '',
    search: '',
  };

  onlyMyTripsFlag = false;

  private restoredEmployeeIds: string[] = [];

  displayedVacationsSignal: WritableSignal<VacationsInterface[]> =
    this.employeeVacationsService.displayedVacationsSignal;

  selectedDateSignal: WritableSignal<Date> =
    this.vacationScheduleService.selectedDateSignal;

  isReportLoadingSignal: WritableSignal<boolean> = signal(false);

  saveReportButtonItems: MenuItem[] = [
    {
      label: 'xlsx',
      command: () => {
        this.downloadReport('xlsx');
      },
    },
    {
      label: 'pdf',
      command: () => {
        this.downloadReport('pdf');
      },
    },
  ];

  constructor(
    // Angular
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,

    // API
    private reportApi: ReportApiService,

    // PrimeNG
    public dialogService: DialogService,

    // Other
    private fileDownloader: FileDownloadService,
    private fileSanitizer: FileSanitizerClass,
    public langUtils: LangUtils,
    public langFacade: LangFacade,
    public vacationsGraphDayOffListFacade: VacationsGraphDayOffListFacade,
    private translatePipe: TranslatePipe,
    public settingsFacade: SettingsFacade,
    public businessTripsTimesheetFacade: BusinessTripsTimesheetFacade,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.issuesTypeList && changes.issuesTypeList.currentValue) {
      this.issueTypeGroups =
        changes.issuesTypeList.currentValue.issueTypeGroups;
    }
    if (
      changes.businessTripsPeriod &&
      changes.businessTripsPeriod.currentValue
    ) {
      this.chosenBusinessTrips = JSON.parse(
        JSON.stringify(changes.businessTripsPeriod.currentValue),
      );

      this.displayedVacationsSignal.set(this.chosenBusinessTrips);
      this.reapplyGraphFilters();
    }
    if (changes.members && changes.members.currentValue) {
      this.employeeList = [
        {
          title: this.translatePipe.transform('TITLE_MY_SUBORDINATES'),
          value: true,
          checked: false,
          items: this.members.members
            .filter((member) => {
              return member.subordinate;
            })
            .map((member) => {
              return {
                title: member.fullName,
                value: member.id,
              };
            }),
        },
        {
          title: this.translatePipe.transform('TITLE_MY_COLLEGUES'),
          value: false,
          checked: false,
          items: this.members.members
            .filter((member) => {
              return !member.subordinate;
            })
            .map((member) => {
              return {
                title: member.fullName,
                value: member.id,
              };
            }),
        },
      ];
      this.restoreEmployeesFromUrl();
    }
    if (
      changes.filterIssuesTypeList &&
      changes.filterIssuesTypeList.currentValue
    ) {
      this.issueTypeGroups =
        changes.filterIssuesTypeList.currentValue.issueTypeGroups;
    }
  }

  ngOnInit(): void {
    this.initFilters();
  }

  ngAfterViewInit(): void {
    // TODO: придумать способ получше (уменьшить количество проверок до минимума: нужно как-то научиться определять, что оверлей фильтра принадлежит конкретному диалогу)
    window.addEventListener('click', (event) => {
      const target: HTMLElement = event.target as HTMLElement;
      const filterDialog: HTMLElement =
        document.getElementById('filters-dialog');
      const pDropdownItemsWrapper: HTMLElement =
        document.getElementsByClassName(
          'p-dropdown-items-wrapper',
        )?.[0] as HTMLElement;

      if (
        filterDialog &&
        !filterDialog.contains(target) &&
        !pDropdownItemsWrapper?.contains(target) &&
        typeof target.className === 'string' &&
        !target.className.includes('p-dropdown-clear-icon')
      ) {
        this.showFilters = false;
        this.ref.detectChanges();
      }
    });
  }

  initFilters(): void {
    const { queryParams } = this.route.snapshot;

    this.filterValue = {
      search: queryParams.search ? decodeURI(queryParams.search) : '',
      count: 15,
      page: queryParams.page || 1,
      days: queryParams.days || '',
    };

    if (queryParams.showType === 'month' || queryParams.showType === 'year') {
      this.filterValues.showType = queryParams.showType;
      this.bufferedFilterValue.showType = queryParams.showType;
      this.calendarConfig = {
        ...this.calendarConfig,
        showType: queryParams.showType,
      };
    }

    if (queryParams.selectedYear) {
      const year = +queryParams.selectedYear;
      const month =
        queryParams.selectedMonth !== undefined
          ? +queryParams.selectedMonth
          : new Date().getMonth();
      const date = new Date(year, month, 1);
      this.vacationScheduleService.selectedDateSignal.set(date);
      this.year = year;
      this.filterValues.month = this.translatePipe.transform(
        this.months[month],
      );
      this.calendarConfig = {
        ...this.calendarConfig,
        date: new Date(year, 0, 1).toISOString(),
        endDate: new Date(year, 11, 31).toISOString(),
        showType: this.filterValues.showType,
      };
      if (year !== new Date().getFullYear()) {
        this.changeYearFilter.emit(year);
      }
    }

    if (queryParams.employees) {
      try {
        this.restoredEmployeeIds = JSON.parse(
          decodeURI(queryParams.employees),
        );
      } catch {
        this.restoredEmployeeIds = [];
      }
    }

    if (queryParams.onlyMyTrips === 'true') {
      this.onlyMyTripsFlag = true;
    }
  }

  applySearchFilter(): void {
    if (this.searchTextCopy !== this.filterValue.search && this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.searchTextCopy = this.filterValue.search;
    this.timeoutId = setTimeout(() => {
      this.applyFilters();
    }, 1000);
  }

  applyFilters(): void {
    this.onLoadList(this.filterValue);
  }

  clearFilters(): void {
    this.filterValue = {
      count: 15,
      page: 1,
      days: '',
      search: '',
    };
  }

  clearFilterByChips(filterType: 'search' | 'days'): void {
    this.filterValue[filterType] = '';
    this.applySearchFilter();
  }

  getPeriodTitleByValue(value: string): string {
    return this.daysValueList.find((day) => day.value === value)?.title ?? value;
  }

  private getGraphFilterQueryParams(): Record<string, string> {
    const params: Record<string, string> = {};

    params.showType = this.filterValues.showType;

    const selectedDate = this.vacationScheduleService.selectedDateSignal();
    if (selectedDate) {
      params.selectedYear = selectedDate.getFullYear().toString();
      params.selectedMonth = selectedDate.getMonth().toString();
    }

    if (this.filterValues.employees.length) {
      params.employees = JSON.stringify(
        this.filterValues.employees.map((e) => e.value),
      );
    }

    if (this.onlyMyTripsFlag) {
      params.onlyMyTrips = 'true';
    }

    return params;
  }

  private saveGraphFiltersToUrl(): void {
    const fullParams = {
      ...this.filterValue,
      ...this.getGraphFilterQueryParams(),
    };
    const queryParams = this.cleanEmptyProps({ ...fullParams });
    this.setQueryUrl(queryParams);
  }

  private restoreEmployeesFromUrl(): void {
    if (!this.restoredEmployeeIds.length) return;

    const allMembers = this.members?.members || [];
    this.filterValues.employees = this.restoredEmployeeIds
      .map((id) => {
        const member = allMembers.find((m) => m.id === id);
        return member
          ? { title: member.fullName, value: member.id }
          : null;
      })
      .filter((e): e is { title: string; value: string } => e !== null);
    this.bufferedFilterValue.employees = [...this.filterValues.employees];
    this.restoredEmployeeIds = [];

    if (this.filterValues.employees.length && this.businessTripsPeriod) {
      this.employeeFilterApply();
    }
  }

  private reapplyGraphFilters(): void {
    if (!this.businessTripsPeriod) return;

    if (this.onlyMyTripsFlag && this.currentUser) {
      this.onlyMyTrips(true);
    } else if (this.filterValues.employees.length) {
      this.employeeFilterApply();
    }
  }

  onGoDetails(issue: { issueID: string }): void {
    this.goDetails.emit(issue.issueID);
  }

  onLoadList(param: BusinessTripsFilterValueInterface): void {
    const fullParams = {
      ...this.filterValue,
      ...param,
      ...this.getGraphFilterQueryParams(),
    };
    const queryParams = this.cleanEmptyProps(fullParams);
    this.setQueryUrl(queryParams);
    this.loadList.emit(param);
  }

  setQueryUrl(queryParams: Record<string, any>): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: '',
    });
  }

  cleanEmptyProps(obj: any): any {
    for (const propName in obj) {
      if (
        obj[propName] === null ||
        obj[propName] === undefined ||
        obj[propName] === ''
      ) {
        delete obj[propName];
      }
    }
    return obj;
  }

  goToCustomIssueAlias(): void {
    this.goToIssueCreation.emit();
  }

  clearEmployeeFilter(index: number): void {
    this.filterValues.employees = this.filterValues.employees.splice(index, 1);
    this.employeeFilterApply();
    this.saveGraphFiltersToUrl();
  }

  clearAllEmployeeFilter(): void {
    this.filterValues.employees = [];
    this.employeeFilterApply();
    this.saveGraphFiltersToUrl();
  }

  onFilterMonthApply(): void {
    const index = this.months.findIndex(
      (month) =>
        this.translatePipe.transform(month) === this.filterValues.month,
    );

    const elementId: string =
      index.toString() + (this.isMobileV() ? 'mobile' : '');

    const element: HTMLElement = document.getElementById(elementId);

    this.saveGraphFiltersToUrl();

    if (!element) return;

    if (this.isMobileV()) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const monthBlock: HTMLElement = element.parentElement;

      monthBlock.animate(
        [
          { backgroundColor: 'black' },
          { backgroundColor: element.parentElement.style.backgroundColor },
        ],
        {
          duration: 3500,
          easing: 'ease-out',
        },
      );
      return;
    }
  }

  onFilterSubmit(data: {
    employees: { title: string; value: string }[];
    showType: 'year' | 'month';
    hasReport: boolean;
  }): void {
    logDebug(`onFilterSubmit -> data:`, data);
    if (
      this.bufferedFilterValue.employees.length !==
      this.filterValues.employees.length
    ) {
      this.employeeFilterApply();
      this.bufferedFilterValue.employees = [...this.filterValues.employees];
    }

    if (this.bufferedFilterValue.showType !== data.showType) {
      this.calendarConfig = undefined;
      this.calendarConfig = {
        date: new Date(this.year, 0, 1).toISOString(),
        endDate: new Date(this.year, 11, 31).toISOString(),
        graphType: 'schedule',
        managementMode: true,
        membersShow: true,
        showDaysOff: true,
        showType: this.filterValues.showType,
        showWorkTime: false,
      };
      this.bufferedFilterValue.showType = this.filterValues.showType;
    }

    if (this.bufferedFilterValue.hasReport !== data.hasReport) {
      this.hasReportFilterApply(data.hasReport);
      this.bufferedFilterValue.hasReport = data.hasReport;
    }

    this.saveGraphFiltersToUrl();
  }

  prevMonth(): void {
    this.vacationScheduleService.selectedDateSignal.update((date: Date) => {
      const monthIndex: number = date.getMonth();
      const newDate = new Date(date);
      newDate.setMonth(monthIndex - 1);
      return newDate;
    });

    this.changeYear();
  }

  nextMonth(): void {
    this.vacationScheduleService.selectedDateSignal.update((date: Date) => {
      const monthIndex: number = date.getMonth();
      const newDate = new Date(date);
      newDate.setMonth(monthIndex + 1);
      return newDate;
    });

    this.changeYear();
  }

  prevYear(): void {
    this.vacationScheduleService.selectedDateSignal.update((date: Date) => {
      const year: number = date.getFullYear();
      const prevYear: number = year - 1;
      date.setFullYear(prevYear);
      return new Date(date);
    });
    this.changeYear();
  }

  nextYear(): void {
    this.vacationScheduleService.selectedDateSignal.update((date: Date) => {
      const year: number = date.getFullYear();
      const nextYear: number = year + 1;
      date.setFullYear(nextYear);
      return date;
    });

    this.changeYear();
  }

  changeYear(
    year: number = this.vacationScheduleService
      .selectedDateSignal()
      ?.getFullYear(),
  ): void {
    this.year = year;
    this.changeYearFilter.emit(year);
    this.calendarConfig = {
      date: new Date(this.year, 0, 1).toISOString(),
      endDate: new Date(this.year, 11, 31).toISOString(),
      graphType: 'schedule',
      managementMode: true,
      membersShow: true,
      showDaysOff: true,
      showType: this.filterValues.showType,
      showWorkTime: false,
    };
    this.saveGraphFiltersToUrl();
  }

  showInfo(data: {
    event: Event;
    period: VacationPeriodInterface;
    vacation: VacationsInterface;
  }): void {
    console.log(123, data);
    const currentType = this.types.find(
      (type) => type.id === data.period.typeId,
    );
    const dialogRef = this.dialogService.open(BusinessTripsInfoDialogComponent, {
      data: {
        dateStart: data.period.originalStartDate ?? data.period.startDate,
        dateEnd: data.period.originalEndDate ?? data.period.endDate,
        count: data.period.daysLength,
        name: data.vacation.name,
        status: data.period.status,
        issueId: data.period.issueId,
        documentId: data.period.documentId,
        pointType: currentType,
        enableButtons: this.currentUser.employees.find(
          (employee) => employee.employeeID === data.vacation.employeeId,
        ),
        linkedIssueTypeId: data.period.linkedIssueTypeId,
        linkedIssueId: data.period.linkedIssueId,
        enableReportButtons:
          this.settingsFacade.getData()?.businessTrips.expenseReportsEnable,
        cancelAccess: data.period.cancelAccess,
      },
      header: this.langUtils.convert(
        this.langFacade.getLang(),
        'STATUS_COMMAND',
      ),
      closable: true,
      dismissableMask: true,
      width: this.isMobileV() ? '100%' : 'auto',
    });
    dialogRef.onClose.subscribe((result) => {
      if (result) this.reloadGraph();
    });
  }

  reloadGraph() {
    this.businessTripsTimesheetFacade.getTimesheet({
      dateBegin: new Date(
        Date.UTC(new Date().getFullYear(), 0, 1)
      ).toISOString(),
      dateEnd: new Date(
        Date.UTC(new Date().getFullYear(), 11, 31)
      ).toISOString(),
      sectionId: this.sectionId,
    });
    this.applyFilters();
  }

  employeeFilterApply(): void {
    this.chosenBusinessTrips = JSON.parse(
      JSON.stringify(this.businessTripsPeriod),
    );

    if (this.filterValues.employees.length) {
      this.chosenBusinessTrips = this.chosenBusinessTrips.filter((trip) => {
        const index = this.filterValues.employees.findIndex(
          (employee) => employee.value === trip.employeeId,
        );
        return index !== -1;
      });
    }

    this.displayedVacationsSignal.set(this.chosenBusinessTrips);
    this.saveGraphFiltersToUrl();
  }

  hasReportFilterApply(value: boolean) {
    this.chosenBusinessTrips = JSON.parse(
      JSON.stringify(this.businessTripsPeriod),
    );

    if (value) {
      this.chosenBusinessTrips.forEach((trip) => {
        trip.periods = trip.periods.filter((period) => period.linkedIssueId);
      });
    }

    this.displayedVacationsSignal.set(this.chosenBusinessTrips);
  }

  onlyMyTrips(value: boolean): void {
    this.onlyMyTripsFlag = value;
    this.chosenBusinessTrips = JSON.parse(
      JSON.stringify(this.businessTripsPeriod),
    );
    if (value) {
      if (this.currentUser?.employees?.length) {
        this.chosenBusinessTrips = this.chosenBusinessTrips.filter((trip) => {
          return this.currentUser.employees.find(
            (employee) => employee.employeeID === trip.employeeId,
          );
        });
      } else {
        this.chosenBusinessTrips = [];
      }
    }

    this.displayedVacationsSignal.set(this.chosenBusinessTrips);
    this.saveGraphFiltersToUrl();
  }

  get disableCreate(): boolean {
    return !this.types?.find(
      (type) => type.showGroup.includes('businessTrips') && type.issueIdCreate,
    );
  }

  protected readonly infoDialogComponent = VacationsInfoDialogComponent;

  getMonthIndex() {
    return this.months.findIndex(
      (m: string) =>
        this.translatePipe.transform(m) === this.filterValues.month,
    );
  }

  async downloadReport(format: 'pdf' | 'xlsx' = 'pdf'): Promise<void> {
    const calendarView: 'year' | 'month' = this.filterValues.showType;

    const displayedVacations: VacationsInterface[] =
      this.employeeVacationsService.displayedVacationsSignal();

    const selectedDate: Date =
      this.vacationScheduleService.selectedDateSignal();

    const dateBegin: Date =
      calendarView === 'month'
        ? beginningOfMonth(selectedDate)
        : beginningOfYear(selectedDate);

    const dateEnd: Date =
      calendarView === 'month'
        ? endOfMonth(selectedDate)
        : endOfYear(selectedDate);

    const params: GetReportParamsInterface = {
      employeeIds: displayedVacations.map((v) => v.employeeId),
      dateBegin,
      dateEnd,
      reportId: 'businessTripsReport',
      format,
    };

    let reportFile: FileBase64;

    // загружаем отчёт с бэка
    this.isReportLoadingSignal.set(true);
    try {
      reportFile = await firstValueFrom(this.reportApi.getReport(params));
    } finally {
      this.isReportLoadingSignal.set(false);
    }

    const safeURL: SafeResourceUrl = this.fileSanitizer.getSafeResourceURLFromFileBase64Data(
      reportFile.file64,
      reportFile.fileExtension,
    );

    // скачиваем отчёт на устройство пользователя (компьютер/планшет/смартфон и т. п.)
    await this.fileDownloader.download(safeURL, reportFile.fileName);
  }
}
