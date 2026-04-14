import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  Preloader,
  providePreloader,
} from '@app/shared/services/preloader.service';
import { MainCurrentUserFacade } from '@app/features/main/facades/main-current-user.facade';
import { VacationsGraphDayOffListFacade } from '@app/features/vacations/facades/vacations-graph-day-off-list.facade';
import { VacationsGraphStatusTypesFacade } from '@app/features/vacations/facades/vacations-graph-status-types.facade';
import { AppButtonComponent } from '@app/shared/components/app-button/app-button.component';
import { AppMonthSelectComponent } from '@app/shared/components/app-month-select/app-month-select.component';
import { AppSelectButtonOptionComponent } from '@app/shared/components/app-select-button/app-select-button-option/app-select-button-option.component';
import { AppSelectButtonComponent } from '@app/shared/components/app-select-button/app-select-button.component';
import { AppYearSelectComponent } from '@app/shared/components/app-year-select/app-year-select.component';
import { SlidersHorizontalIcon, PlusIcon } from 'lucide-angular';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { LangModule } from '../../../shared/features/lang/lang.module';
import { BusinessTripService, BusinessTripFilters } from '../shared/business-trip.service';
import { BusinessTripMonthViewerComponent } from '../business-trip-month-viewer/business-trip-month-viewer.component';
import { BusinessTripYearViewerComponent } from '../business-trip-year-viewer/business-trip-year-viewer.component';
import { AppButtonFilterComponent } from '@app/shared/components/app-button-filter/app-button-filter.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { AppFilterChipComponent } from '@app/shared/components/app-filter-chip/app-filter-chip.component';
import { ProgressBar } from 'primeng/progressbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import {
  ReportApiService,
  GetReportParamsInterface,
} from '@app/shared/services/api/report-api.service';
import { FileDownloadService } from '@app/shared/services/file-download.service';
import { FileSanitizerClass } from '@app/shared/utilits/download-file.utils';
import { firstValueFrom } from 'rxjs';
import {
  beginningOfMonth,
  beginningOfYear,
  endOfMonth,
  endOfYear,
} from '@app/shared/utils/datetime/common';

@Component({
  selector: 'app-employee-business-trip-v2',
  imports: [
    SelectButtonModule,
    AppSelectButtonComponent,
    AppSelectButtonOptionComponent,
    ButtonModule,
    AppButtonComponent,
    BusinessTripYearViewerComponent,
    AppYearSelectComponent,
    AppMonthSelectComponent,
    BusinessTripMonthViewerComponent,
    LangModule,
    AppButtonFilterComponent,
    CheckboxModule,
    FormsModule,
    MultiSelectModule,
    AppFilterChipComponent,
    SplitButtonModule,
  ],
  templateUrl: './employee-business-trip-v2.component.html',
  styleUrl: './employee-business-trip-v2.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [providePreloader(ProgressBar)],
})
export class EmployeeBusinessTripV2Component implements OnInit, OnDestroy {
  private dialogService = inject(DialogService);
  private preloader = inject(Preloader);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private reportApi = inject(ReportApiService);
  private fileDownloader = inject(FileDownloadService);
  private fileSanitizer = inject(FileSanitizerClass);

  businessTripService = inject(BusinessTripService);
  userFacade = inject(MainCurrentUserFacade);
  vacationsStatusFacade = inject(VacationsGraphStatusTypesFacade);
  vacationsGraphDayOffListFacade = inject(VacationsGraphDayOffListFacade);

  trips = this.businessTripService.trips;
  statusTypes = this.businessTripService.statusTypes;
  loading$ = toObservable(this.businessTripService.loading);
  loadingData$ = toObservable(this.businessTripService.loadingData);
  loadingData = this.businessTripService.loadingData;
  viewType = this.businessTripService.viewType;

  year = this.businessTripService.year;
  month = this.businessTripService.month;
  fullMonth = this.businessTripService.fullMonth;

  SlidersHorizontalIcon = SlidersHorizontalIcon;
  PlusIcon = PlusIcon;

  filters = this.businessTripService.filters;

  private filtersInitialized = false;

  // Для кнопки скачивания отчёта
  isReportLoading = signal(false);
  saveReportButtonItems: MenuItem[] = [
    {
      label: 'xlsx',
      command: () => this.downloadReport('xlsx'),
    },
    {
      label: 'pdf',
      command: () => this.downloadReport('pdf'),
    },
  ];

  employeeFilterOptions = computed(() => {
    const trips = this.businessTripService.trips();

    const all = trips.map((trip) => ({
      title: trip.name,
      value: trip.employeeId,
      subordinated: trip.subordinated,
    }));

    return [
      {
        title: 'TITLE_MY_SUBORDINATES',
        value: true,
        items: all.filter((trip) => trip.subordinated),
      },
      {
        title: 'TITLE_MY_COLLEGUES',
        value: false,
        items: all.filter((trip) => !trip.subordinated),
      },
    ];
  });

  constructor() {
    effect(() => {
      const viewType = this.viewType();
      const year = this.year();
      const month = this.month();
      const filters = this.filters();

      if (this.filtersInitialized) {
        this.saveFiltersToUrl(viewType, year, month, filters);
      }
    });
  }

  ngOnInit(): void {
    this.restoreFiltersFromUrl();
    this.filtersInitialized = true;

    this.businessTripService.enter('employeeBusinessTrips');

    this.vacationsStatusFacade.show();
    this.vacationsGraphDayOffListFacade.show({
      startDate: new Date(new Date().getFullYear() - 2, 0, 1).toISOString(),
      stopDate: new Date(new Date().getFullYear() + 2, 11, 31).toISOString(),
    });
    this.preloader.setCondition(this.loadingData$);
  }

  ngOnDestroy(): void {
    // Сбрасываем sectionId при уходе со страницы
    this.businessTripService.leave('businessTrips');
  }

  goToCreateIssue(): void {
    // Навигация на страницу создания заявки на командировку
    this.router.navigate(['/employee-business-trip', 'create', 'businessTrip']);
  }

  async downloadReport(format: 'pdf' | 'xlsx' = 'pdf'): Promise<void> {
    const calendarView = this.viewType();
    const trips = this.businessTripService.filteredTrips();
    const year = this.year();
    const [yearVal, monthVal] = this.fullMonth();

    const dateBegin =
      calendarView === 'month'
        ? beginningOfMonth(new Date(yearVal, monthVal, 1))
        : beginningOfYear(new Date(year, 0, 1));

    const dateEnd =
      calendarView === 'month'
        ? endOfMonth(new Date(yearVal, monthVal, 1))
        : endOfYear(new Date(year, 0, 1));

    const params: GetReportParamsInterface = {
      employeeIds: trips.map((t) => t.employeeId),
      dateBegin,
      dateEnd,
      reportId: 'businessTripsReport',
      format,
    };

    this.isReportLoading.set(true);
    try {
      const reportFile = await firstValueFrom(this.reportApi.getReport(params));
      const safeURL = this.fileSanitizer.getSafeResourceURLFromFileBase64Data(
        reportFile.file64,
        reportFile.fileExtension,
      );
      await this.fileDownloader.download(safeURL, reportFile.fileName);
    } finally {
      this.isReportLoading.set(false);
    }
  }

  patchFilters(filters: Partial<BusinessTripFilters>): void {
    this.businessTripService.filters.set({
      ...this.businessTripService.filters(),
      ...filters,
    });
  }

  onChangeEmployeesFilter(event: string[]): void {
    this.patchFilters({
      employees: event,
    });
  }

  onChangeEmployeesFilterGroup(
    group: { items: { value: string }[] },
    event: boolean,
  ): void {
    let employees = this.filters().employees;
    if (event) {
      employees = [...employees, ...group.items.map((item) => item.value)];
    } else {
      employees = employees.filter(
        (employee) => !group.items.some((item) => item.value === employee),
      );
    }
    this.patchFilters({
      employees,
    });
  }

  private restoreFiltersFromUrl(): void {
    const { queryParams } = this.route.snapshot;

    if (queryParams['viewType'] === 'year' || queryParams['viewType'] === 'month') {
      this.businessTripService.viewType.set(queryParams['viewType']);
    }

    if (queryParams['year']) {
      this.businessTripService.year.set(+queryParams['year']);
    }

    if (queryParams['month']) {
      this.businessTripService.month.set(+queryParams['month']);
    }

    const filters: Partial<BusinessTripFilters> = {};

    if (queryParams['hasIntersection'] === 'true') {
      filters.hasIntersection = true;
    }

    if (queryParams['employees']) {
      try {
        filters.employees = JSON.parse(decodeURI(queryParams['employees']));
      } catch {
        // ignore
      }
    }

    if (Object.keys(filters).length) {
      this.patchFilters(filters);
    }
  }

  private saveFiltersToUrl(
    viewType: string,
    year: number,
    month: number,
    filters: BusinessTripFilters,
  ): void {
    const params: Record<string, string> = {
      viewType,
      year: year.toString(),
      month: month.toString(),
    };

    if (filters.hasIntersection) {
      params['hasIntersection'] = 'true';
    }

    if (filters.employees.length) {
      params['employees'] = JSON.stringify(filters.employees);
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: '',
    });
  }
}
