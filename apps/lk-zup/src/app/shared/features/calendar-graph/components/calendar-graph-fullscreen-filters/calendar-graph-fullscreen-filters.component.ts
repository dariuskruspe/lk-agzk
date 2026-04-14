import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  output,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { EmployeesListFormFilterValueInterface } from '@features/employees/models/employees.interface';
import { VacationsManagementDialogComponent } from '@features/vacations/components/vacations-management-dialog/vacations-management-dialog.component';
import { VacationsGraphFilterInterface } from '@features/vacations/models/vacations-graph-filter.interface';
import { VacationsInterface } from '@features/vacations/models/vacations.interface';
import { WorkStatusInterface } from '@shared/features/calendar-graph/models/calendar-graph-member-list.interface';
import { EmployeeVacationsService } from '@shared/features/calendar-graph/services/employee-vacations.service';
import { VacationScheduleService } from '@shared/features/calendar-graph/services/vacation-schedule.service';
import { VacationsGraphService } from '@features/vacations/sevices/vacations-graph.service';
import { TranslatePipe } from '@shared/features/lang/pipes/lang.pipe';
import { PageStorageInterface } from '@shared/interfaces/storage/page/page-storage.interface';
import { AppService } from '@shared/services/app.service';
import { FilterService } from '@shared/services/filter.service';
import { clearSelection } from '@shared/utils/DOM/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-calendar-graph-fullscreen-filters',
  templateUrl: './calendar-graph-fullscreen-filters.component.html',
  styleUrls: ['./calendar-graph-fullscreen-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CalendarGraphFullscreenFiltersComponent
  implements OnInit, OnChanges
{
  app: AppService = inject(AppService);

  dialogService: DialogService = inject(DialogService);

  vacationScheduleService: VacationScheduleService = inject(
    VacationScheduleService,
  );

  route: ActivatedRoute = inject(ActivatedRoute);

  employeeVacationsService = inject(EmployeeVacationsService);

  vacationsGraphService: VacationsGraphService = inject(VacationsGraphService);

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  currentPageStorage: PageStorageInterface = this.app.storage.page.current;

  urlSegmentsSignal: WritableSignal<UrlSegment[]> =
    this.currentPageStorage.data.frontend.signal.urlSegments;

  settings = computed(() => {
    return this.app.storage.settings.data.frontend.signal.globalSettings();
  });

  @Input() filterValues: VacationsGraphFilterInterface;

  @Input() employeeList: {
    title: string;
    value: boolean;
    checked: boolean;
    items: { title: string; value: string }[];
  }[];

  @Input() months: string[];

  @Input() trips: 'employeeBusinessTrips' | 'businessTrips' | null = null;

  @Input() subtitleText: string = '';

  @Input() showFullscreenIcon: boolean = false;

  @Input() showEditButton: boolean = true;

  @Input() disablePlanningButton: boolean = false;

  @Input() types: WorkStatusInterface[];

  @Input() isFullscreen: boolean = false;

  @Input() isBusinessTrips: boolean = false;

  @Output() clearIntersection = new EventEmitter();

  @Output() clearEmployee = new EventEmitter<number>();

  @Output() clearApproval = new EventEmitter();

  @Output() monthApply = new EventEmitter();

  @Output() yearChanged = new EventEmitter<number>();

  @Output() filterSubmit = new EventEmitter<VacationsGraphFilterInterface>();

  @Output() showDialogFullscreen = new EventEmitter();

  @Output() clearAllEmployee = new EventEmitter();

  @Output() clearDepartment = new EventEmitter();

  @Output() openEditPlanning = new EventEmitter();

  @Output() onlyMyTripsFilter = new EventEmitter<boolean>();

  vacationsManagementTabSignal: WritableSignal<
    'ALL_VACATIONS' | 'VACATIONS_TO_BE_APPROVED'
  > = this.employeeVacationsService.vacationsManagementTabSignal;

  vacationsManagementToBeApprovedCountSignal: WritableSignal<number> =
    this.employeeVacationsService.vacationsManagementToBeApprovedCountSignal;

  displayedVacationsSignal: WritableSignal<VacationsInterface[]> =
    this.employeeVacationsService.displayedVacationsSignal;

  tabChanged = output<{ from: string; to: string }>();

  showFilters: boolean = false;

  showLegend: boolean = true;

  employeeListCopy;

  onlyMyTrips = false;

  /* Поля для фильтрации (хитро украдено со страницы "Мои заявки" (issues-list-dashboard.component.ts ^_^) */

  searchTextCopy;

  timeoutId;

  statusList = [];

  filterValue: EmployeesListFormFilterValueInterface = {
    useSkip: true,
    count: 15,
    page: 1,
    search: '',
    state: '',
    organizationID: '',
    departments: [],
    myDept: false,
  };

  years: number[] = [];

  selectedDateSignal: WritableSignal<Date> =
    this.vacationScheduleService.selectedDateSignal;

  departments: { id: string; name: string }[] = [];

  selectedDepartments: { id: string; name: string }[]= [];

  get selectedDepartmentName(): string {
    if (!this.filterValues?.departmentIds.length || !this.departments.length) {
      return '';
    }
    const departments = this.departments.filter(
      (d) => this.filterValues.departmentIds.includes(d.id),
    );
    return departments.length === 1 ? departments[0].name : `Подразделения: ${departments.length}`;
  }

  constructor(
    // Angular
    private cd: ChangeDetectorRef,

    // Other
    private filterService: FilterService,
    private translatePipe: TranslatePipe,
    private router: Router,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.employeeList && changes.employeeList.currentValue) {
      this.employeeListCopy = JSON.parse(JSON.stringify(this.employeeList));
    }
  }

  ngOnInit(): void {
    this.initYears();
    if (this.settings()?.vacationSchedule?.vacationDepartmentsFilterEnabled) {
      this.loadDepartments();
    }
    const { queryParams } = this.route.snapshot;
    if (queryParams.tab) {
      this.changeTab(
        queryParams.tab.toUpperCase() === 'VACATIONS_TO_BE_APPROVED'
          ? 'VACATIONS_TO_BE_APPROVED'
          : 'ALL_VACATIONS',
      );
    }
    if (queryParams.onlyMyTrips === 'true') {
      this.onlyMyTrips = true;
    }
  }

  private loadDepartments(): void {
    this.vacationsGraphService.getDepartments().subscribe({
      next: (departments) => {
        console.log(`departments`, departments);
        this.departments = departments.departments;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.departments = [];
        this.cd.detectChanges();
      },
    });
  }

  onDepartmentChange(): void {
    const departmentIds = this.filterValues.departmentIds || [];
    const departments = this.departments.filter(
      (d) => departmentIds.includes(d.id),
    );
    if (departments.length) {
      this.selectedDepartments = departments;
    } else {
      this.selectedDepartments = [];
    }
    this.onFilterSubmit(this.filterValues);
  }

  clearDepartmentFilter(): void {
    this.filterValues.departmentIds = [];
    this.selectedDepartments = [];
    this.clearDepartment.emit();
    this.onFilterSubmit(this.filterValues);
  }

  /**
   * Переходим на указанную вкладку.
   *
   * @param tabName название вкладки
   * @param options (необязательный параметр) опции
   */
  changeTab(
    tabName: 'VACATIONS_TO_BE_APPROVED' | 'ALL_VACATIONS',
    options?: { force: boolean },
  ): void {
    const fromTab: string = this.vacationsManagementTabSignal();
    if (fromTab !== tabName || options?.force) {
      this.vacationsManagementTabSignal.set(tabName);
      this.tabChanged.emit({ from: fromTab, to: tabName });
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      queryParamsHandling: 'merge',
    });
  }

  private initYears(): void {
    const currentYear: number = new Date().getFullYear();
    const selectedYear = this.selectedDateSignal()?.getFullYear();
    const beforeCount: number = 2;
    const afterCount: number = 2;

    this.years = [];

    for (let i = beforeCount; i > 0; i--) {
      this.years.push(currentYear - i);
    }

    for (let i = 0; i <= afterCount; i++) {
      this.years.push(currentYear + i);
    }

    this.filterValues.year = selectedYear || currentYear;
  }

  clearIntersectionFilter(): void {
    this.clearIntersection.emit();
  }

  clearEmployeeFilter(index: number): void {
    this.clearEmployee.emit(index);
    this.checkEmployeesSelectedGroup(this.filterValues.employees);
  }

  onFilterMonthApply() {
    const monthIndex = this.months.findIndex(
      (month) =>
        this.translatePipe.transform(month) === this.filterValues.month,
    );

    if (monthIndex === -1) return;

    this.selectedDateSignal.update((date: Date) => {
      const newDate = new Date(date);
      newDate.setMonth(monthIndex);
      return newDate;
    });
    this.monthApply.emit();
  }

  onYearChange(year: number): void {
    this.yearChanged.emit(year);
  }

  onFilterSubmit(value: VacationsGraphFilterInterface) {
    this.filterSubmit.emit(value);
  }

  onFilterEmployeeSubmit(value: VacationsGraphFilterInterface) {
    this.checkEmployeesSelectedGroup(value.employees);
    this.onFilterSubmit(value);
  }

  getFullObject(option: any) {
    return option; // Возвращаем полный объект
  }

  checkEmployeesSelectedGroup(
    valueEmployees: { title: string; value: string }[],
  ): void {
    if (valueEmployees.length === this.employeesCount) {
      this.employeeList.forEach((emplGroup) => {
        emplGroup.checked = true;
      });
    } else if (valueEmployees.length === 0) {
      this.employeeList.forEach((emplGroup) => {
        emplGroup.checked = false;
      });
    } else {
      this.employeeList.forEach((emplGroup) => {
        let allChecked = true;
        emplGroup.items.forEach((employee) => {
          const index = valueEmployees.findIndex((selectedEmployee) => {
            return selectedEmployee.value === employee.value;
          });
          allChecked = allChecked && index !== -1;
        });
        emplGroup.checked = allChecked;
      });
    }
  }

  showDialog() {
    this.showDialogFullscreen.emit();
  }

  clearAllEmployeeFilter(): void {
    this.employeeList.forEach((group) => (group.checked = false));
    this.clearAllEmployee.emit();
  }

  onGroupClick(group: {
    title: string;
    value: boolean;
    checked: boolean;
    items: { title: string; value: string }[];
  }): void {
    if (group.checked) {
      group.items.forEach((item) => {
        // Проверяем, есть ли уже такой сотрудник в списке
        const alreadyExists = this.filterValues.employees.some(
          (employee) => employee.value === item.value,
        );
        if (!alreadyExists) {
          this.filterValues.employees.push(item);
        }
      });
    } else {
      group.items.forEach((item) => {
        const index = this.filterValues.employees.findIndex((employee) => {
          return employee.value === item.value;
        });
        if (index !== -1) {
          this.filterValues.employees.splice(index, 1);
        }
      });
    }
    this.onFilterEmployeeSubmit(this.filterValues);
  }

  get employeesCount(): number {
    let count = 0;
    this.employeeList?.forEach((emplGroup) => {
      count = count + emplGroup.items.length;
    });
    return count;
  }

  onSearchInput(event: Event): boolean {
    const searchText = (event.target as HTMLInputElement).value;
    this.employeeList = JSON.parse(JSON.stringify(this.employeeListCopy));
    this.employeeList.forEach((emplGroup) => {
      emplGroup.items = emplGroup.items.filter((employee) => {
        return employee.title.toLowerCase().includes(searchText.toLowerCase());
      });
    });
    this.employeeList = this.employeeList.filter((emplGroup) => {
      return emplGroup.items.length;
    });
    event.stopPropagation();
    return false;
  }

  clearEmployeeSearchFilter(): void {
    const searchFilterInput = document.getElementById(
      'search-employee-box',
    ) as HTMLInputElement;
    searchFilterInput.value = '';
    this.employeeList = JSON.parse(JSON.stringify(this.employeeListCopy));
  }

  get legendList(): WorkStatusInterface[] {
    if (this.types?.length) {
      const scheduleId = this.trips ? 'businessTrips' : 'vacationSchedule';
      let listAll = [...this.types].reverse().filter((type) => {
        return type.showGroup.includes(scheduleId);
      });
      if (this.trips) {
        listAll = listAll.reverse();
        const res = [
          listAll[0],
          { ...listAll[0], approving: true },
          { ...listAll[0], approving: false },
        ];
        if (this.settings().businessTrips.expenseReportsEnable) {
          res.unshift({
            ...listAll[0],
            availibleAndLinkedIssue: true,
            color: 'var(--done)',
            label: '',
          });
        }
        return res;
      } else {
        return [
          listAll[0],
          { ...listAll[0], approving: true },
          { ...listAll[0], approving: false },
          listAll[1],
        ];
      }
    }
    return [];
  }

  get hasChips(): boolean {
    const departmentsFilterEnabled = !this.trips && 
      this.settings()?.vacationSchedule?.vacationDepartmentsFilterEnabled;
    return (
      this.filterValues.hasIntersection ||
      !!this.filterValues.employees.length ||
      this.filterValues.requiringApproval ||
      (departmentsFilterEnabled && !!this.filterValues.departmentIds?.length)
    );
  }

  openEditPlanningClick(): void {
    this.openEditPlanning.emit();
  }

  /**
   * Переключить (скрыть/показать) легенду.
   */
  toggleLegend(): void {
    this.showLegend = !this.showLegend;
    clearSelection();
  }

  toggleFilters(e: MouseEvent): void {
    this.showFilters = !this.showFilters;
    e.stopPropagation();
    clearSelection();
    this.onFiltersDialogOutsideClick();
  }

  onFiltersDialogOutsideClick(): void {
    if (this.showFilters) {
      const blurCallback = (): void => {
        this.showFilters = false;
        this.cd.detectChanges();
        this.removeFiltersDialogOutsideClickEventListener();
      };

      this.filtersDialogOutsideClickHandler =
        this.filterService.addClickOutsideFiltersDialogEventListener(
          blurCallback,
          {
            // (!!!) Вызов обработчика события 'click' глобального объекта window (где вызывается blurCallback)
            // происходит раньше, чем вызов обработчика toggleFilters, в котором происходит переключение булевой
            // переменной showFilters, отвечающей за отображение/скрытие диалогового окна с фильтрами,
            // поэтому добавляем CSS-класс кнопки вызова диалога с фильтрами в исключения (не вызываем blurCallback)
            // во избежание нарушения логики работы.
            exceptElementClasses: ['btn-filter'],
          },
        );
    } else {
      // На случай, если blurCallback, в котором происходит удаление EventListener, не будет вызван (например, при
      // передаче параметра exceptElementClasses).
      this.removeFiltersDialogOutsideClickEventListener();
    }
  }

  removeFiltersDialogOutsideClickEventListener(): void {
    window.removeEventListener(
      'click',
      this.filtersDialogOutsideClickHandler,
      true,
    );
  }

  /**
   * Ссылка на обработчик нажатия мимо (снаружи от) диалогового окна с фильтрами.
   * Инициализируется в методе onFiltersDialogOutsideClick.
   */
  private filtersDialogOutsideClickHandler: () => void;

  /**
   * Обработчик событий, поступающих при изменении чекбокса "Выделить все", предназначенного для выделения всех
   * сотрудников в списке (графике) отпусков.
   *
   * @param $event событие
   */
  onAllEmployeeCheckboxChange($event: any) {
    const displayedVacations: VacationsInterface[] =
      this.displayedVacationsSignal() || [];

    const matchedEmployeeIds: string[] = displayedVacations.map(
      (v) => v.employeeId,
    );

    this.employeeVacationsService.setSelectedEmployeeIds(
      $event.checked ? matchedEmployeeIds : [],
    );

    this.employeeVacationsService.setSelectedEmployeeVacations(
      $event.checked ? displayedVacations : [],
    );

    // WTF: триггерим перерисовку
    const calendarConfig =
      this.employeeVacationsService.calendarConfig$.getValue();
    this.employeeVacationsService.calendarConfig$.next({ ...calendarConfig });
  }

  /**
   * Показываем диалог подтверждения решения пользователя по согласованию/отклонению отпусков сотрудников.
   */
  showConfirmDecisionDialog(action: 'approve' | 'decline'): void {
    const ref: DynamicDialogRef<VacationsManagementDialogComponent> =
      this.dialogService.open(VacationsManagementDialogComponent, {
        data: {
          action,
        },
        header: this.translatePipe.transform('CONFIRMATION'),
        closable: true,
        dismissableMask: true,
        width: this.isMobileV() ? '100%' : '60%',
      });

    ref.onClose.pipe(take(1)).subscribe((): void => {});
  }
}
