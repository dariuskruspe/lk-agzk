import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  Type,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { MainCurrentUserFacade } from '@features/main/facades/main-current-user.facade';
import { VacationOverlapsComponent } from '@features/vacations/components/vacation-overlaps/vacation-overlaps.component';
import { VacationsGraphDayOffListInterface } from '@features/vacations/models/vacations-graph-day-off-list.interface';
import { VacationsGraphFilterInterface } from '@features/vacations/models/vacations-graph-filter.interface';
import { VacationsStatesInterface } from '@features/vacations/models/vacations-states.interface';
import {
  VacationPeriodInterface,
  VacationsInterface,
} from '@features/vacations/models/vacations.interface';
import { WorkStatusInterface } from '@shared/features/calendar-graph/models/calendar-graph-member-list.interface';
import { CalendarGraphInterface } from '@shared/features/calendar-graph/models/calendar-graph.interface';
import { VacationsDataInterface } from '@shared/features/calendar-graph/models/vacations-data.interface';
import { EmployeeVacationsService } from '@shared/features/calendar-graph/services/employee-vacations.service';
import { VacationScheduleService } from '@shared/features/calendar-graph/services/vacation-schedule.service';
import { TranslatePipe } from '@shared/features/lang/pipes/lang.pipe';
import { PageStorageInterface } from '@shared/interfaces/storage/page/page-storage.interface';
import { AppService } from '@shared/services/app.service';
import { CustomDialogService } from '@shared/services/dialog.service';
import { logDebug } from '@shared/utilits/logger';
import { isDateRangeOverlap } from '@shared/utils/datetime/common';
import { FpcInterface } from '@wafpc/base/models/fpc.interface';
import moment from 'moment/moment';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'calendar-graph',
  templateUrl: './calendar-graph-container.component.html',
  styleUrls: ['./calendar-graph-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DialogService,
      useClass: CustomDialogService,
    },
  ],
  standalone: false,
})
export class CalendarGraphContainerComponent implements OnChanges, OnInit {
  app = inject(AppService);

  cd = inject(ChangeDetectorRef);

  vacationScheduleService: VacationScheduleService = inject(
    VacationScheduleService,
  );

  employeeVacationsService: EmployeeVacationsService = inject(
    EmployeeVacationsService,
  );

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  settingsStorage = this.app.storage.settings;

  langTagSignal = this.settingsStorage.data.frontend.signal.langTag;

  themeSignal = this.settingsStorage.data.frontend.signal.theme;

  currentPageStorage: PageStorageInterface = this.app.storage.page.current;

  urlSegmentsSignal: WritableSignal<UrlSegment[]> =
    this.currentPageStorage.data.frontend.signal.urlSegments;

  /**
   * Количество подчинённых (текущему пользователю) сотрудников, имеющих отпуска со статусом "К согласованию".
   */
  vacationsManagementToBeApprovedCountSignal: WritableSignal<number> =
    this.employeeVacationsService.vacationsManagementToBeApprovedCountSignal;

  displayedVacationsSignal: WritableSignal<VacationsInterface[]> =
    this.employeeVacationsService.displayedVacationsSignal;

  allEmployeeCheckboxSignal: WritableSignal<boolean> =
    this.employeeVacationsService.allEmployeeCheckboxSignal;

  selectedEmployeeIdsSignal: WritableSignal<string[]> =
    this.employeeVacationsService.selectedEmployeeIdsSignal;

  enableEmployeeSelectionSignal: WritableSignal<boolean> =
    this.employeeVacationsService.enableEmployeeSelectionSignal;

  selectedDateSignal: WritableSignal<Date> =
    this.vacationScheduleService.selectedDateSignal;

  @Input() set vacations(value: VacationsInterface[]) {
    // Если значение null или undefined (например, во время обновления данных),
    // не очищаем существующие данные, чтобы список не становился пустым
    if (value == null || this.year !== this.selectedDateSignal()?.getFullYear()) {
      return;
    }
    // eslint-disable-next-line no-underscore-dangle
    this._vacations = value;
    const selectedVacations: VacationsInterface[] = this.filterEmployees(
      this.bufferedEmployees,
      this.bufferedRequiringApproval,
    );
    this.chosenVacations = selectedVacations;
    this.displayedVacationsSignal.set(selectedVacations);
  }

  @Input() loading: boolean;

  @Input() initYear: number;

  private _vacations: VacationsInterface[];

  @Input() types: WorkStatusInterface[] = [];

  @Input() states: VacationsStatesInterface;

  @Input() dialogComponent: Type<unknown>;

  @Input() calendarConfig: CalendarGraphInterface;

  @Input() filterConfig: FpcInterface;

  @Input() filterConfigFullscreen: FpcInterface;

  @Input() dayOffList: VacationsGraphDayOffListInterface;

  @Input() daysOfWeek: string[];

  @Input() months: string[];

  @Input() disablePlanningButton = false;

  @Output() filterSubmit = new EventEmitter();

  @Output() openApproval = new EventEmitter<VacationsInterface>();

  @Output() openEdit = new EventEmitter<{
    vacation: VacationsInterface;
    period: VacationPeriodInterface;
  }>();

  @Output() openEditPlanning = new EventEmitter();

  chosenVacations: VacationsInterface[] = [];

  private bufferedEmployees: string[] | string = [];

  private bufferedShowType: 'year' | 'month' = 'year';

  private bufferedRequiringApproval = false;

  private bufferedDepartmentIds: string[] = [];

  visible = false;

  year = this.vacationScheduleService.selectedDateSignal()?.getFullYear();

  showFullscreenFilters = false;

  convertedData: VacationsDataInterface[] = [];

  employeeList = [];

  filterValues: VacationsGraphFilterInterface = {
    date: new Date().getFullYear(),
    endDate: new Date().toISOString(),
    employees: [],
    showType: 'year',
    requiringApproval: false,
    hasIntersection: false,
    month: null,
  };

  vacationsManagementTabSignal: WritableSignal<
    'ALL_VACATIONS' | 'VACATIONS_TO_BE_APPROVED'
  > = this.employeeVacationsService.vacationsManagementTabSignal;

  constructor(
    public currentUserFacade: MainCurrentUserFacade,
    private dialog: DialogService,
    private translatePipe: TranslatePipe,
    public activatedRoute: ActivatedRoute,
  ) {
    effect(() => {
      logDebug('[calendar-graph-container.component.ts]: effect');
      logDebug('allEmployeeCheckboxSignal: ', this.allEmployeeCheckboxSignal());
      logDebug('selectedEmployeeIdsSignal: ', this.selectedEmployeeIdsSignal());

      // WTF: дичь, но по-другому перерисовка чекбоксов почему-то не происходит при их активации, несмотря на наличие сигналов
      this.magicalRedraw();
    });
  }

  magicalRedraw() {
    this.calendarConfig = { ...this.calendarConfig };
    this.cd.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.initYear && changes.initYear.currentValue) {
      this.year = this.initYear;
      this.employeeVacationsService.selectedYearSignal.set(this.year);
      this.filterValues.date = this.initYear;
      this.selectedDateSignal.update((date: Date) => {
        const newDate = new Date(date);
        newDate.setFullYear(this.initYear);
        return newDate;
      });
    }
    if (
      changes.vacations &&
      changes.vacations.currentValue &&
      this.types &&
      this.types.length
    ) {
      this.toBeApprovedCountHandler();
      this.applyFilters();
      setTimeout(() => {
        this.scrollRight();
      }, 100);
    }
    if (
      changes.types &&
      changes.types.currentValue &&
      changes.types.currentValue.length &&
      this._vacations
    ) {
      this.toBeApprovedCountHandler();
      this.applyFilters();
      setTimeout(() => {
        this.scrollRight();
      }, 100);
    }
  }

  ngOnInit() {
    const params = this.activatedRoute?.snapshot?.queryParams;
    if (params.year) {
      this.year = +params.year;
      this.employeeVacationsService.selectedYearSignal.set(+params.year);
      this.filterValues.date = +params.year;
      this.selectedDateSignal.update((date: Date) => {
        const newDate = new Date(date);
        newDate.setFullYear(+params.year);
        return newDate;
      });
    }
    if (params.showType) {
      this.filterValues.showType = params.showType;
    }
    if (params.requiringApproval) {
      this.filterValues.requiringApproval = params.requiringApproval === 'true';
    }
  }

  showDialog() {
    this.visible = true;
  }

  scrollRight(): void {
    let monthIndex: number = this.months.findIndex(
      (month) => month === this.filterValues.month,
    );

    if (monthIndex === -1) monthIndex = new Date().getMonth();

    const element = document.getElementById(monthIndex.toString());

    if (element) {
      element?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'center',
      });
    }
  }

  prevMonth() {
    this.vacationScheduleService.selectedDateSignal.update((date: Date) => {
      const monthIndex: number = date.getMonth();
      const newDate = new Date(date);
      newDate.setMonth(monthIndex - 1);
      return newDate;
    });

    this.changeYear();
  }

  nextMonth() {
    this.vacationScheduleService.selectedDateSignal.update((date: Date) => {
      const monthIndex: number = date.getMonth();
      const newDate = new Date(date);
      newDate.setMonth(monthIndex + 1);
      return newDate;
    });

    this.changeYear();
  }

  prevYear() {
    this.vacationScheduleService.selectedDateSignal.update((date: Date) => {
      const year: number = date.getFullYear();
      const prevYear: number = year - 1;
      date.setFullYear(prevYear);
      return new Date(date);
    });

    this.changeYear();
  }

  nextYear() {
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
  ) {
    logDebug(`changeYear()`, year);
    if (!year) return;
    this.filterValues.date = year;
    this.onFilterSubmit({
      ...this.filterValues,
      date: year,
    });
  }

  onFilterSubmit(filterValues: VacationsGraphFilterInterface): void {
    this.loading = true;
    logDebug(`filterValues:`, filterValues);

    if (isNaN(+filterValues.date)) {
      filterValues.date = new Date(filterValues.date).getFullYear();
    }

    if (!this.checkChanges(filterValues)) {
      if (!filterValues.date && !filterValues.endDate) {
        filterValues.date = this.vacationScheduleService
          .selectedDateSignal()
          ?.getFullYear();
      }
      this.filterSubmit.emit(filterValues);
    }

    this.applyFilters();
  }

  applyFilters(): void {
    const { filterValues } = this;

    this.bufferedEmployees = filterValues.employees.map(
      (employee) => employee.value,
    );

    this.bufferedRequiringApproval = !!filterValues.requiringApproval;
    this.bufferedShowType = filterValues.showType;
    this.bufferedDepartmentIds = [...(filterValues.departmentIds || [])];
    this.year =
      +filterValues.date ||
      this.vacationScheduleService.selectedDateSignal()?.getFullYear();
    this.employeeVacationsService.selectedYearSignal.set(this.year);
    // Защита от null/undefined - не обновляем данные, если они отсутствуют
    if (!this._vacations || !Array.isArray(this._vacations)) {
      return;
    }
    this.chosenVacations = this._vacations;
    this.displayedVacationsSignal.set(this._vacations);
    this.convertData();
    const selectedVacations = this.filterEmployees(
      this.bufferedEmployees,
      this.bufferedRequiringApproval,
      filterValues.hasIntersection,
      filterValues.showType,
      filterValues.showType === 'month' ? this.getSelectedMonthIndex() : null,
      filterValues.departmentIds,
    );
    this.chosenVacations = selectedVacations;
    console.log(`this.chosenVacations`, this.chosenVacations);
    this.displayedVacationsSignal.set(selectedVacations);
    this.convertData();
    this.convertedData = this.convertedData.filter((data) =>
      filterValues.hasIntersection ? data.hasIntersection : data,
    );

    if (
      this.urlSegmentsSignal()?.[0]?.path === 'vacations-management' &&
      this.vacationsManagementTabSignal() === 'VACATIONS_TO_BE_APPROVED'
    )
      this.applyVacationsForApprovalFilter();

    this.loading = false;
  }

  onFilterMonthApply() {
    this.changeYear();
  }

  checkChanges(filterValues: VacationsGraphFilterInterface): boolean {
    return (
      this.bufferedEmployees.length === filterValues.employees.length &&
      this.bufferedRequiringApproval === !!filterValues.requiringApproval &&
      this.bufferedShowType === filterValues.showType &&
      this.bufferedDepartmentIds.every(id => (filterValues.departmentIds || []).includes(id)) &&
      !filterValues.date
    );
  }

  showInfo(data: {
    event: Event;
    vacation: VacationsInterface;
    period: VacationPeriodInterface;
  }): void {
    if (
      !data.period.approved &&
      this.currentUserFacade
        .getData()
        .employees.find(
          (employee) => employee.employeeID === data.vacation.employeeId,
        )
    ) {
      this.openEdit.emit({
        vacation: data.vacation,
        period: data.period,
      });
    } else {
      this.dialog.open(this.dialogComponent, {
        dismissableMask: true,
        closable: true,
        data: {
          ...data,
          states: this.states,
        },
      });
    }
  }

  onOpenApproval(value: VacationsInterface): void {
    this.openApproval.next(value);
  }

  private filterEmployees(
    employees: string[] | string,
    requiringApproval: boolean,
    hasIntersections: boolean = false,
    showType: 'month' | 'year' = 'year',
    selectedMonthIndex: number | null = null,
    departmentIds?: string[],
  ): VacationsInterface[] {
    // Защита от null/undefined
    if (!this._vacations || !Array.isArray(this._vacations)) {
      return [];
    }
    let filteredEmployees = employees.length
      ? // eslint-disable-next-line no-underscore-dangle
        this._vacations.filter((v) => employees.includes(v.employeeId))
      : // eslint-disable-next-line no-underscore-dangle
        this._vacations;
    
    // Фильтрация по подразделению
    if (departmentIds?.length) {
      filteredEmployees = filteredEmployees.filter(
        (v) => departmentIds.includes(v.departmentId),
      );
    }
    
    if (requiringApproval) {
      filteredEmployees = filteredEmployees.filter((employee) =>
        this.hasUnsigned(employee),
      );
    }
    if (hasIntersections) {
      // Фильтруем только сотрудников с пересечениями среди уже отфильтрованных
      filteredEmployees = filteredEmployees.filter((employee) => {
        return this.hasIntersectionWithFilteredEmployees(
          employee,
          filteredEmployees,
          showType,
          selectedMonthIndex,
        );
      });
    }
    return filteredEmployees;
  }

  private hasUnsigned(vacation: VacationsInterface): boolean {
    return !!vacation.periods.find(
      (period) => !period.approved && period.activeApprovement,
    );
  }

  private hasIntersectionWithFilteredEmployees(
    employee: VacationsInterface,
    filteredEmployees: VacationsInterface[],
    showType: 'month' | 'year' = 'year',
    selectedMonthIndex: number | null = null,
  ): boolean {
    // Проверяем пересечения только с другими отфильтрованными сотрудниками
    return filteredEmployees.some((otherEmployee) => {
      if (otherEmployee.employeeId === employee.employeeId) {
        return false; // Не проверяем пересечения с самим собой
      }

      // Проверяем пересечения периодов отпусков
      return employee.periods.some((employeePeriod) => {
        return otherEmployee.periods.some((otherPeriod) => {
          const employeePeriodStart = new Date(employeePeriod.startDate);
          const employeePeriodEnd = new Date(employeePeriod.endDate);
          const otherPeriodStart = new Date(otherPeriod.startDate);
          const otherPeriodEnd = new Date(otherPeriod.endDate);

          // Если режим отображения - месяц, проверяем пересечения только в выбранном месяце
          if (showType === 'month' && selectedMonthIndex !== null) {
            const selectedYear = this.year;
            const monthStart = new Date(selectedYear, selectedMonthIndex, 1);
            const monthEnd = new Date(
              selectedYear,
              selectedMonthIndex + 1,
              0,
              23,
              59,
              59,
              999,
            );

            // Проверяем, что оба периода пересекаются с выбранным месяцем
            const employeePeriodInMonth = this.isPeriodIntersectingMonth(
              employeePeriodStart,
              employeePeriodEnd,
              monthStart,
              monthEnd,
            );
            const otherPeriodInMonth = this.isPeriodIntersectingMonth(
              otherPeriodStart,
              otherPeriodEnd,
              monthStart,
              monthEnd,
            );

            if (!employeePeriodInMonth || !otherPeriodInMonth) {
              return false;
            }

            // Если оба периода попадают в месяц, проверяем их пересечение
            return isDateRangeOverlap(
              {
                start: employeePeriodStart,
                end: employeePeriodEnd,
              },
              {
                start: otherPeriodStart,
                end: otherPeriodEnd,
              },
            );
          }

          // Для режима "год" проверяем пересечения как обычно
          return isDateRangeOverlap(
            {
              start: employeePeriodStart,
              end: employeePeriodEnd,
            },
            {
              start: otherPeriodStart,
              end: otherPeriodEnd,
            },
          );
        });
      });
    });
  }

  /**
   * Проверяет, пересекается ли период отпуска с выбранным месяцем
   */
  private isPeriodIntersectingMonth(
    periodStart: Date,
    periodEnd: Date,
    monthStart: Date,
    monthEnd: Date,
  ): boolean {
    return isDateRangeOverlap(
      {
        start: periodStart,
        end: periodEnd,
      },
      {
        start: monthStart,
        end: monthEnd,
      },
    );
  }

  /**
   * Получает индекс выбранного месяца (0-11)
   */
  private getSelectedMonthIndex(): number | null {
    // Используем месяц из selectedDateSignal, который всегда актуален
    // и синхронизирован с выбранным месяцем в фильтрах
    const selectedDate = this.selectedDateSignal();
    return selectedDate ? selectedDate.getMonth() : null;
  }

  convertData(): void {
    this.convertedData = [];
    // Защита от null/undefined
    if (!this.chosenVacations || !Array.isArray(this.chosenVacations)) {
      return;
    }
    this.chosenVacations?.forEach((vac, employeeIndex) => {
      const periods = [];
      let hasIntersection = false;
      for (let i = 0; i <= 11; i++) {
        periods[i] = [];
      }
      vac.periods.forEach((period) => {
        const type = this.types?.find((typeEl) => {
          return typeEl.id === period.typeId;
        });
        const periodStart = new Date(period.startDate);
        const periodEnd = new Date(period.endDate);
        const targetYear = new Date(this.calendarConfig?.date ?? period.startDate).getFullYear();
        const yearStart = new Date(targetYear, 0, 1);
        const yearEnd = new Date(targetYear, 11, 31, 23, 59, 59);

        // Пересечение периода с текущим годом
        const segmentStart = periodStart > yearStart ? periodStart : yearStart;
        const segmentEnd = periodEnd < yearEnd ? periodEnd : yearEnd;

        if (this.filterValues.showType === 'month') {
          if (segmentStart > segmentEnd) {
            return;
          }

          // Определяем диапазон месяцев
          let currentMonthDate = new Date(segmentStart.getFullYear(), segmentStart.getMonth(), 1);
          const lastMonthDate = new Date(segmentEnd.getFullYear(), segmentEnd.getMonth(), 1);

          while (currentMonthDate <= lastMonthDate) {
            const monthIdx = currentMonthDate.getMonth();
            const monthStart = new Date(targetYear, monthIdx, 1);
            const monthEnd = new Date(targetYear, monthIdx + 1, 0, 23, 59, 59);

            const rangeStart = segmentStart > monthStart ? segmentStart : monthStart;
            const rangeEnd = segmentEnd < monthEnd ? segmentEnd : monthEnd;

            if (rangeStart <= rangeEnd) {
              periods[monthIdx].push({
                daysCount: this.getCountDays(rangeStart, rangeEnd),
                daysFromStart: this.getCountDays(monthStart, rangeStart),
                color: type?.color,
                status: type?.label,
                fullPeriod: {
                  ...period,
                  originalStartDate: period.originalStartDate ?? period.startDate,
                  originalEndDate: period.originalEndDate ?? period.endDate,
                },
                approved: period.approved,
              });
            }
            currentMonthDate.setMonth(currentMonthDate.getMonth() + 1);
          }
        } else {
          const index = periodStart.getMonth();
          const dateStartMonth = new Date(periodStart.getFullYear(), periodStart.getMonth(), 1);
          periods[index].push({
            daysCount: this.getCountDays(periodStart, periodEnd),
            daysFromStart: this.getCountDays(dateStartMonth, periodStart),
            color: type?.color,
            status: type?.label,
            fullPeriod: period,
            approved: period.approved,
          });
        }
        // Защита от null/undefined при проверке пересечений
        if (this._vacations && Array.isArray(this._vacations)) {
          this._vacations.forEach((vacation, indexOfEmployee) => {
            if (indexOfEmployee !== employeeIndex) {
              vacation.periods.forEach((vacationPeriod) => {
                hasIntersection =
                  hasIntersection ||
                  isDateRangeOverlap(
                    {
                      start: new Date(period.startDate),
                      end: new Date(period.endDate),
                    },
                    {
                      start: new Date(vacationPeriod.startDate),
                      end: new Date(vacationPeriod.endDate),
                    },
                  );
              });
            }
          });
        }
      });
      this.convertedData.push({
        name: vac.name,
        hasIntersection,
        vacations: periods,
        fullVacation: vac,
        employeeId: vac.employeeId,
      });
    });
    this.employeeList = this.filterConfig.template.find(
      (temp) => temp.formControlName === 'employees',
    ).optionList;
  }

  getCountDays(start: Date, end: Date): number {
    const difference = end.getTime() - start.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24));
  }

  clearIntersectionFilter() {
    this.filterValues.hasIntersection = false;
    this.onFilterSubmit(this.filterValues);
  }

  clearApprovalFilter() {
    this.filterValues.requiringApproval = false;
    this.onFilterSubmit(this.filterValues);
  }

  clearDepartmentFilter() {
    this.filterValues.departmentIds = [];
    this.onFilterSubmit(this.filterValues);
  }

  clearEmployeeFilter(index: number) {
    this.filterValues.employees.splice(index, 1);
    this.onFilterSubmit(this.filterValues);
  }

  clearAllEmployeeFilter() {
    this.filterValues.employees = [];
    this.onFilterSubmit(this.filterValues);
  }

  closeDialogFullscreen(): void {
    this.visible = false;
  }

  openEditPlanningClick(): void {
    this.openEditPlanning.emit();
  }

  getTooltip(vacation: VacationPeriodInterface): string {
    if (!vacation || !vacation.startDate || !vacation.endDate) return '';
    return (
      moment(vacation.startDate).format('DD.MM.YYYY').toString() +
      ' - ' +
      moment(vacation.endDate).format('DD.MM.YYYY').toString()
    );
  }

  /**
   * Показываем диалоговое окно с пересечениями отпусков.
   *
   * @param vacationData информация об отпусках выбранного сотрудника
   */
  showVacationOverlaps(vacationData: VacationsDataInterface): void {
    if (!vacationData.hasIntersection) return;
    this.dialog.open(VacationOverlapsComponent, {
      header: this.translatePipe.transform('OVERLAPS'),
      data: {
        selectedEmployeeId: vacationData.employeeId,
        vacationsData: this.convertedData,
        workStatuses: this.types,
      },
      width: '90%',
      height: '90%',
    });
  }

  toBeApprovedCountHandler(): void {
    const toBeApprovedVacations: VacationsInterface[] =
      this.displayedVacationsSignal()?.filter((v) =>
        v.periods.some(
          (period) => !period.approved && period.activeApprovement,
        ),
      );
    const count: number = toBeApprovedVacations?.length || 0;
    this.vacationsManagementToBeApprovedCountSignal.set(count);
  }

  onTabChange($event: { from: string; to: string }): void {
    if (this.urlSegmentsSignal()?.[0]?.path === 'vacations-management') {
      this.clearAllEmployeeFilter();
      if (this.vacationsManagementTabSignal() === 'VACATIONS_TO_BE_APPROVED') {
        this.applyVacationsForApprovalFilter();
        this.enableEmployeeSelectionSignal.set(true);
      } else {
        this.enableEmployeeSelectionSignal.set(false);
      }

      if (this.vacationsManagementTabSignal() === 'ALL_VACATIONS') {
        this.clearAllEmployeeFilter();
      }
    }
  }

  applyVacationsForApprovalFilter(): void {
    if (!this.displayedVacationsSignal()?.length) return;

    const vacationsForApproval =
      this.displayedVacationsSignal()?.filter((v) =>
        v.periods.some(
          (period) => !period.approved && period.activeApprovement,
        ),
      ) || [];

    this.chosenVacations = vacationsForApproval;
    this.displayedVacationsSignal.set(vacationsForApproval);

    this.convertedData = this.convertedData.filter((vData) =>
      vData.fullVacation.periods.some(
        (period) => !period.approved && period.activeApprovement,
      ),
    );
  }
}
