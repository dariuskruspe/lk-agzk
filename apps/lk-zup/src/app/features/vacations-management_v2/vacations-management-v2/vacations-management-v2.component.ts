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
import { ActivatedRoute, Router } from '@angular/router';
import {
  Preloader,
  providePreloader,
} from '@app/shared/services/preloader.service';
import { MainCurrentUserFacade } from '@app/features/main/facades/main-current-user.facade';
import { VacationsAvailableDaysFacade } from '@app/features/vacations/facades/vacations-available-days.facade';
import { VacationsGraphDayOffListFacade } from '@app/features/vacations/facades/vacations-graph-day-off-list.facade';
import { VacationsGraphStatusTypesFacade } from '@app/features/vacations/facades/vacations-graph-status-types.facade';
import { VacationsManagementDialogComponent } from '@app/features/vacations/components/vacations-management-dialog/vacations-management-dialog.component';
import { AppButtonComponent } from '@app/shared/components/app-button/app-button.component';
import { AppMonthSelectComponent } from '@app/shared/components/app-month-select/app-month-select.component';
import { AppSelectButtonOptionComponent } from '@app/shared/components/app-select-button/app-select-button-option/app-select-button-option.component';
import { AppSelectButtonComponent } from '@app/shared/components/app-select-button/app-select-button.component';
import { AppYearSelectComponent } from '@app/shared/components/app-year-select/app-year-select.component';
import { SlidersHorizontalIcon } from 'lucide-angular';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { LangModule } from '../../../shared/features/lang/lang.module';
import { TranslatePipe } from '@app/shared/features/lang/pipes/lang.pipe';
import { VacationsService } from '../../vacations_v2/shared/vacations.service';
import { VacationsMonthViewerComponent } from '../../vacations_v2/vacations-month-viewer/vacations-month-viewer.component';
import { VacationsYearViewerComponent } from '../../vacations_v2/vacations-year-viewer/vacations-year-viewer.component';
import { AppButtonFilterComponent } from '@app/shared/components/app-button-filter/app-button-filter.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { AppFilterChipComponent } from '@app/shared/components/app-filter-chip/app-filter-chip.component';
import { ProgressBar } from 'primeng/progressbar';
import { EmployeeVacationsService } from '@app/shared/features/calendar-graph/services/employee-vacations.service';
import { TooltipModule } from 'primeng/tooltip';
import {
  createVacationRouteQueryKey,
  normalizeVacationRouteQueryParams,
  parseVacationRouteState,
  serializeVacationRouteState,
  VacationFilters,
} from '../../vacations_v2/shared/vacations-route-state';

type VacationsManagementTab = 'ALL_VACATIONS' | 'VACATIONS_TO_BE_APPROVED';

@Component({
  selector: 'app-vacations-management-v2',
  imports: [
    SelectButtonModule,
    AppSelectButtonComponent,
    AppSelectButtonOptionComponent,
    ButtonModule,
    AppButtonComponent,
    VacationsYearViewerComponent,
    AppYearSelectComponent,
    AppMonthSelectComponent,
    VacationsMonthViewerComponent,
    LangModule,
    AppButtonFilterComponent,
    CheckboxModule,
    FormsModule,
    MultiSelectModule,
    AppFilterChipComponent,
    TooltipModule,
  ],
  templateUrl: './vacations-management-v2.component.html',
  styleUrl: './vacations-management-v2.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [providePreloader(ProgressBar)],
})
export class VacationsManagementV2Component implements OnInit, OnDestroy {
  private dialogService = inject(DialogService);
  private translatePipe = inject(TranslatePipe);
  private preloader = inject(Preloader);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  vacationsService = inject(VacationsService);
  vacationsAvailableDays = inject(VacationsAvailableDaysFacade);
  userFacade = inject(MainCurrentUserFacade);
  vacationsStatusFacade = inject(VacationsGraphStatusTypesFacade);
  vacationsGraphDayOffListFacade = inject(VacationsGraphDayOffListFacade);
  employeeVacationsService = inject(EmployeeVacationsService);

  vacations = this.vacationsService.vacations;
  statusTypes = this.vacationsService.statusTypes;
  loading$ = toObservable(this.vacationsService.loading);
  loadingData$ = toObservable(this.vacationsService.loadingData);
  loadingData = this.vacationsService.loadingData;
  viewType = this.vacationsService.viewType;

  year = this.vacationsService.year;
  month = this.vacationsService.month;
  fullMonth = this.vacationsService.fullMonth;

  SlidersHorizontalIcon = SlidersHorizontalIcon;

  filters = this.vacationsService.filters;
  private routeDefaults = this.vacationsService.getDefaultRouteState();

  activeTab = signal<VacationsManagementTab>('ALL_VACATIONS');
  toBeApprovedCount = this.vacationsService.toBeApprovedCount;
  selectedEmployeeIds = this.employeeVacationsService.selectedEmployeeIdsSignal;
  allEmployeeCheckbox = this.employeeVacationsService.allEmployeeCheckboxSignal;

  employeeFilterOptions = computed(() => {
    const vacations = this.vacationsService.vacations();

    const all = vacations.map((vacation) => ({
      title: vacation.name,
      value: vacation.employeeId,
      subordinated: vacation.subordinated,
    }));

    return [
      {
        title: 'TITLE_MY_SUBORDINATES',
        value: true,
        items: all.filter((vacation) => vacation.subordinated),
      },
      {
        title: 'TITLE_MY_COLLEGUES',
        value: false,
        items: all.filter((vacation) => !vacation.subordinated),
      },
    ];
  });

  constructor() {
    effect(() => {
      if (!this.vacationsService.initialized()) {
        return;
      }

      const routeState = this.vacationsService.getRouteState();
      const nextQueryParams = serializeVacationRouteState(
        routeState,
        this.routeDefaults,
      );
      const currentQueryKey = normalizeVacationRouteQueryParams(
        this.route.snapshot.queryParams,
        this.routeDefaults,
      );
      const nextQueryKey = createVacationRouteQueryKey(
        routeState,
        this.routeDefaults,
      );

      if (currentQueryKey === nextQueryKey) {
        return;
      }

      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: nextQueryParams,
        queryParamsHandling: '',
        replaceUrl: true,
      });
    });
  }

  ngOnInit(): void {
    this.vacationsService.sectionId.set('employeesVacations');
    this.vacationsService.showOnlyForApproval.set(false);
    this.vacationsService.initializeRouteState(
      parseVacationRouteState(this.route.snapshot.queryParams, this.routeDefaults),
    );

    this.vacationsStatusFacade.show();
    this.vacationsGraphDayOffListFacade.show({
      startDate: new Date(new Date().getFullYear() - 2, 0, 1).toISOString(),
      stopDate: new Date(new Date().getFullYear() + 2, 11, 31).toISOString(),
    });
    this.vacationsAvailableDays.show({
      year: this.year(),
    });
    this.preloader.setCondition(this.loadingData$);
  }

  ngOnDestroy(): void {
    this.vacationsService.pauseRouteState();
    this.vacationsService.sectionId.set('vacationSchedule');
    this.vacationsService.showOnlyForApproval.set(false);
    this.employeeVacationsService.enableEmployeeSelectionSignal.set(false);
    this.employeeVacationsService.setSelectedEmployeeIds([]);
    this.employeeVacationsService.setSelectedEmployeeVacations([]);
    this.employeeVacationsService.allEmployeeCheckboxSignal.set(false);
  }

  changeTab(tab: VacationsManagementTab): void {
    if (this.activeTab() === tab) {
      return;
    }

    this.activeTab.set(tab);

    if (tab === 'ALL_VACATIONS') {
      this.vacationsService.showOnlyForApproval.set(false);
      this.employeeVacationsService.enableEmployeeSelectionSignal.set(false);
      this.employeeVacationsService.setSelectedEmployeeIds([]);
      this.employeeVacationsService.setSelectedEmployeeVacations([]);
      this.employeeVacationsService.allEmployeeCheckboxSignal.set(false);
    } else {
      this.vacationsService.showOnlyForApproval.set(true);
      this.employeeVacationsService.enableEmployeeSelectionSignal.set(true);
    }
  }

  onAllEmployeeCheckboxChange(event: { checked: boolean }): void {
    const filteredVacations = this.vacationsService.filteredVacations();

    if (event.checked) {
      const allIds = filteredVacations.map((v) => v.employeeId);
      this.employeeVacationsService.setSelectedEmployeeIds(allIds);
      this.employeeVacationsService.setSelectedEmployeeVacations(filteredVacations);
    } else {
      this.employeeVacationsService.setSelectedEmployeeIds([]);
      this.employeeVacationsService.setSelectedEmployeeVacations([]);
    }
  }

  showConfirmDecisionDialog(action: 'approve' | 'decline'): void {
    // Синхронизируем год в EmployeeVacationsService для использования в диалоге
    this.employeeVacationsService.selectedYearSignal.set(this.year());

    const ref = this.dialogService.open(VacationsManagementDialogComponent, {
      data: { action },
      header: this.translatePipe.transform('CONFIRMATION'),
      closable: true,
      dismissableMask: true,
      width: '60%',
    });

    ref.onClose.subscribe((result: boolean) => {
      if (result) {
        // После успешного согласования/отклонения — перезагружаем данные
        this.vacationsService.reload();
        this.employeeVacationsService.setSelectedEmployeeIds([]);
        this.employeeVacationsService.setSelectedEmployeeVacations([]);
        this.employeeVacationsService.allEmployeeCheckboxSignal.set(false);
      }
    });
  }

  patchFilters(filters: Partial<VacationFilters>): void {
    this.vacationsService.filters.set({
      ...this.vacationsService.filters(),
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
}
