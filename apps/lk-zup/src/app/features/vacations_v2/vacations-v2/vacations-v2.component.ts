import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainCurrentUserFacade } from '@app/features/main/facades/main-current-user.facade';
import { VacationsApproveDialogComponent } from '@app/features/vacations/components/vacations-approve-dialog/vacations-approve-dialog.component';
import { VacationsEditDialogComponent } from '@app/features/vacations/components/vacations-edit-dialog/vacations-edit-dialog.component';
import { VacationsApprovalFacade } from '@app/features/vacations/facades/vacations-approval.facade';
import { VacationsAvailableDaysFacade } from '@app/features/vacations/facades/vacations-available-days.facade';
import { VacationsGraphDayOffListFacade } from '@app/features/vacations/facades/vacations-graph-day-off-list.facade';
import { VacationsGraphEditPeriodsFacade } from '@app/features/vacations/facades/vacations-graph-edit-periods.facade';
import { VacationsGraphStatusTypesFacade } from '@app/features/vacations/facades/vacations-graph-status-types.facade';
import {
  VacationActionEnum,
  VacationsApprovalInterface,
} from '@app/features/vacations/models/vacations-approval.interface';
import { VacationPeriodInterface } from '@app/features/vacations/models/vacations.interface';
import { AppButtonComponent } from '@app/shared/components/app-button/app-button.component';
import { AppMonthSelectComponent } from '@app/shared/components/app-month-select/app-month-select.component';
import { AppSelectButtonOptionComponent } from '@app/shared/components/app-select-button/app-select-button-option/app-select-button-option.component';
import { AppSelectButtonComponent } from '@app/shared/components/app-select-button/app-select-button.component';
import { AppYearSelectComponent } from '@app/shared/components/app-year-select/app-year-select.component';
import { LangFacade } from '@app/shared/features/lang/facades/lang.facade';
import {
  ArrowDownToLineIcon,
  PlusIcon,
  SlidersHorizontalIcon,
} from 'lucide-angular';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { take } from 'rxjs/operators';
import { LangModule } from '../../../shared/features/lang/lang.module';
import {
  VacationItemComputed,
  VacationsService,
} from '../shared/vacations.service';
import { VacationsMonthViewerComponent } from '../vacations-month-viewer/vacations-month-viewer.component';
import { VacationsYearViewerComponent } from '../vacations-year-viewer/vacations-year-viewer.component';
import { AppButtonFilterComponent } from '@app/shared/components/app-button-filter/app-button-filter.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { AppFilterChipComponent } from '@app/shared/components/app-filter-chip/app-filter-chip.component';
import { TranslatePipe } from '@app/shared/features/lang/pipes/lang.pipe';
import { AppSpinner } from '@app/shared/components/app-spinner';
import {
  createVacationRouteQueryKey,
  normalizeVacationRouteQueryParams,
  parseVacationRouteState,
  serializeVacationRouteState,
  VacationFilters,
} from '../shared/vacations-route-state';

@Component({
  selector: 'app-vacations-v2',
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
    AppSpinner,
  ],
  templateUrl: './vacations-v2.component.html',
  styleUrl: './vacations-v2.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class VacationsV2Component implements OnInit, OnDestroy {
  dialogService = inject(DialogService);
  vacationsService = inject(VacationsService);
  vacationsAvailableDays = inject(VacationsAvailableDaysFacade);
  userFacade = inject(MainCurrentUserFacade);
  langFacade = inject(LangFacade);
  vacationsStatusFacade = inject(VacationsGraphStatusTypesFacade);
  vacationsGraphDayOffListFacade = inject(VacationsGraphDayOffListFacade);
  private vacationsApprovalFacade = inject(VacationsApprovalFacade);
  private vacationsGraphEditPeriodsFacade = inject(
    VacationsGraphEditPeriodsFacade,
  );
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  vacations = this.vacationsService.vacations;
  statusTypes = this.vacationsService.statusTypes;
  loading = this.vacationsService.loading;
  loadingData = this.vacationsService.loadingData;
  viewType = this.vacationsService.viewType;

  year = this.vacationsService.year;
  month = this.vacationsService.month;
  fullMonth = this.vacationsService.fullMonth;

  ArrowDownToLineIcon = ArrowDownToLineIcon;
  PlusIcon = PlusIcon;
  SlidersHorizontalIcon = SlidersHorizontalIcon;

  filters = this.vacationsService.filters;
  private routeDefaults = this.vacationsService.getDefaultRouteState();
  pageLoading = computed(() => this.loading() || this.loadingData());

  availableDaysLoading = computed(() => this.vacationsAvailableDays.loadingSignal());

  scheduleDisabled = computed(() => {
    if (this.availableDaysLoading()) {
      return true;
    }
    const availableDays = this.vacationsAvailableDays.getData();
    if (!availableDays?.planEnable) {
      return true;
    }
    if (!availableDays?.vacationTypes?.length) {
      return true;
    }
    return false;
  });

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

  constructor(private translatePipe: TranslatePipe) {
    effect(() => {
      if (!this.vacationsService.initialized()) {
        return;
      }

      this.vacationsAvailableDays.show({
        year: this.year(),
      });
    });

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

  ngOnInit() {
    this.vacationsService.sectionId.set('vacationSchedule');
    this.vacationsService.initializeRouteState(
      parseVacationRouteState(this.route.snapshot.queryParams, this.routeDefaults),
    );
    this.vacationsStatusFacade.show();
    this.vacationsGraphDayOffListFacade.show({
      startDate: new Date(new Date().getFullYear() - 2, 0, 1).toISOString(),
      stopDate: new Date(new Date().getFullYear() + 2, 11, 31).toISOString(),
    });
  }

  ngOnDestroy() {
    this.vacationsService.pauseRouteState();
  }

  openEditDialog(): void {
    if (this.scheduleDisabled()) {
      return;
    }

    const currentUser = this.userFacade.getData();
    const currentVacation = this.vacations()?.find((vacation) =>
      currentUser?.employees?.some(
        (employee) => employee.employeeID === vacation.employeeId,
      ),
    );

    const dialogRef = this.dialogService.open(VacationsEditDialogComponent, {
      header: this.translatePipe.transform('VACATION_DIALOG_TITLE_edit'),
      data: {
        type: 'edit',
        vacation: currentVacation,
        year: this.year(),
        availableDays: this.vacationsAvailableDays.getData(),
        user: currentUser,
        lang: this.langFacade.getLang(),
        statuses: this.vacationsStatusFacade.getData(),
        states: { states: this.vacationsService.states() },
        types: this.vacationsService.vacationTypes(),
        daysOff: this.vacationsGraphDayOffListFacade.getData(),
        editPeriodsFacade: this.vacationsGraphEditPeriodsFacade,
      },
      dismissableMask: true,
      closable: true,
      autoZIndex: false,
    });

    dialogRef.onClose.pipe(take(1)).subscribe((result) => {
      if (result?.action) {
        this.submitApproval(result);
      }
      if (result?.saved || result?.action) {
        this.vacationsService.reload();
        this.vacationsAvailableDays.show({ year: this.year() });
      }
    });
  }

  openApproveDialog(vacation: VacationItemComputed): void {
    const dialogRef = this.dialogService.open(VacationsApproveDialogComponent, {
      header: this.translatePipe.transform('VACATION_DIALOG_TITLE_approve'),
      data: {
        type: 'approve',
        vacation,
        year: this.year(),
        availableDays: this.vacationsAvailableDays.getData(),
        user: this.userFacade.getData(),
        lang: this.langFacade.getLang(),
        statuses: this.vacationsStatusFacade.getData(),
        states: { states: this.vacationsService.states() },
        types: this.vacationsService.vacationTypes(),
        daysOff: this.vacationsGraphDayOffListFacade.getData(),
      },
      dismissableMask: true,
      closable: true,
      autoZIndex: false,
    });

    dialogRef.onClose.pipe(take(1)).subscribe((result) => {
      if (result?.action) {
        this.submitApproval(result);
        this.vacationsService.reload();
        this.vacationsAvailableDays.show({ year: this.year() });
      }
    });
  }

  private submitApproval(result: {
    action: VacationActionEnum;
    year: number;
    periods?: VacationPeriodInterface[];
    employees?: VacationsApprovalInterface[];
  }): void {
    switch (result.action) {
      case VacationActionEnum.approve:
      case VacationActionEnum.discard:
        this.vacationsApprovalFacade.edit({
          param: {
            year: result.year || new Date().getFullYear(),
          },
          action: result.action,
          employees: result.employees ?? [],
        });
        break;
      case VacationActionEnum.save:
        this.vacationsGraphEditPeriodsFacade.edit({
          params: {
            year: result.year || new Date().getFullYear(),
          },
          periods: result.periods ?? [],
        });
        break;
      default:
        break;
    }
  }

  patchFilters(filters: Partial<VacationFilters>) {
    this.vacationsService.filters.set({
      ...this.vacationsService.filters(),
      ...filters,
    });
  }

  onChangeEmployeesFilter(event: string[]) {
    this.patchFilters({
      employees: event,
    });
  }

  onChangeEmployeesFilterGroup(
    group: { items: { value: string }[] },
    event: boolean,
  ) {
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
