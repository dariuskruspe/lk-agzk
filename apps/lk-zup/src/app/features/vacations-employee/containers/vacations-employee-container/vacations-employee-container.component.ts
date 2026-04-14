import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  Inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainCurrentUserFacade } from '@features/main/facades/main-current-user.facade';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '@features/main/utils/breadcrumb-provider.utils';
import { VacationsEmployeeDownloadListFacade } from '@features/vacations-employee/facades/vacations-empployee-download-list.facade';
import { VacationsEmployeeDownloadFacade } from '@features/vacations-employee/facades/vacations-empployee-download.facade';
import { VacationsEmployeeListFacade } from '@features/vacations-employee/facades/vacations-empployee-list.facade';
import { VacationsEmployeeMembersFacade } from '@features/vacations-employee/facades/vacations-empployee-members.facade';
import { EmployeeInterface } from '@features/vacations-employee/models/vacations.interface';
import { LangFacade } from '@shared/features/lang/facades/lang.facade';
import { AppService } from '@shared/services/app.service';
import { CustomDialogService } from '@shared/services/dialog.service';
import { FilterService } from '@shared/services/filter.service';
import {
  Preloader,
  providePreloader,
} from '@shared/services/preloader.service';
import { combineLoadings } from '@shared/utilits/combine-loadings.utils';
import { toUnzonedDate } from '@shared/utilits/to-unzoned-date.util';
import { clearSelection } from '@shared/utils/DOM/common';
import { sameDate } from '@shared/utils/datetime/common';
import { DialogService } from 'primeng/dynamicdialog';
import { ProgressBar } from 'primeng/progressbar';
import { Observable } from 'rxjs';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-vacations-employee-container',
    templateUrl: './vacations-employee-container.component.html',
    styleUrls: ['./vacations-employee-container.component.scss'],
    providers: [
        providePreloader(ProgressBar),
        {
            provide: DialogService,
            useClass: CustomDialogService,
        },
        provideBreadcrumb('BREADCRUMBS_VACATIONS', 0),
    ],
    standalone: false
})
export class VacationsEmployeeContainerComponent
  implements OnInit, AfterViewInit
{
  app: AppService = inject(AppService);

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  initYear: number;

  loading$: Observable<boolean>;

  isDownloadEmployeeReportInProgress$: Observable<boolean>;

  isDownloadEmployeeReportsInProgress$: Observable<boolean>;

  downloadFormat: 'pdf' | 'xlsx' = 'pdf';

  /* Поля для фильтрации (хитро украдено со страницы "Мои заявки" (issues-list-dashboard.component.ts ^_^) */
  searchTextCopy;

  showFilters: boolean = false;

  timeoutId: ReturnType<typeof setTimeout>;

  filterValue: any = {
    useSkip: true,
    count: 15,
    page: 1,
    search: '',
    date: new Date(),
    selectedEmployeeIds: [],
  };

  today: Date = new Date();

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

  sortField: 'fullName' | 'vacationBegin' = 'fullName';

  sortButtonItems: MenuItem[] = [
    {
      label: 'ФИО сотрудника',
      command: () => this.applySorting('fullName'),
    },
    {
      label: 'Дата начала отпуска',
      command: () => this.applySorting('vacationBegin'),
    },
  ];

  constructor(
    private ref: ChangeDetectorRef,
    public vacationsEmployeeMembersFacade: VacationsEmployeeMembersFacade,
    public vacationsEmployeeListFacade: VacationsEmployeeListFacade,
    public vacationsEmployeeDownloadFacade: VacationsEmployeeDownloadFacade,
    public vacationsEmployeeDownloadListFacade: VacationsEmployeeDownloadListFacade,
    public userFacade: MainCurrentUserFacade,
    private filterService: FilterService,
    public dialog: DialogService,
    private preloader: Preloader,
    private langFacade: LangFacade,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(BREADCRUMB) private _: unknown
  ) {}

  ngOnInit(): void {
    this.today.setHours(0, 0, 0, 0);

    this.loading$ = combineLoadings(
      this.vacationsEmployeeMembersFacade.loading$(),
      this.vacationsEmployeeListFacade.loading$()
    );
    this.preloader.setCondition(this.loading$);
  }

  ngAfterViewInit(): void {
    this.initFilters();
    this.applyFilters();
    this.vacationsEmployeeListFacade.show();
  }

  /* Фильтрация хитро украдена со страницы "Мои заявки" (issues-list-dashboard.component.ts) ^_^ */

  initFilters() {
    const { queryParams } = this.route.snapshot;

    const isQueryParamDateValid: boolean = !isNaN(
      Date.parse(decodeURI(queryParams.date))
    );
    const date: Date = new Date(
      isQueryParamDateValid ? new Date(decodeURI(queryParams.date)) : this.today
    );
    date.setHours(0, 0, 0, 0);

    this.filterValue = {
      count: 15,
      page: queryParams.page || 1,
      date,
      search: queryParams.search ? decodeURI(queryParams.search) : '',
      selectedEmployeeIds: [],
    };
  }

  setQueryUrl(queryParams: Record<string, any>) {
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
    const fullParams = { ...this.filterValue };
    const queryParams = this.cleanEmptyProps(fullParams);
    this.setQueryUrl(queryParams);

    this.vacationsEmployeeMembersFacade.show({
      date: this.filterValue.date,
      name: this.filterValue.search,
    });
  }

  getEmployeeChipTitleByID(employeeID: string): string {
    const filteredEmployees: EmployeeInterface[] = this.getEmployeesByFilter(
      this.vacationsEmployeeMembersFacade.getData()
    );

    const matchedEmployee: EmployeeInterface = filteredEmployees?.find(
      (e) => e.employeeID === employeeID
    );

    return matchedEmployee?.fullName;
  }

  /**
   * Очищаем метки (chips — "чипы") фильтров.
   *
   * @param filterType тип фильтра
   * @param arrayItem (необязательный параметр) конкретный элемент массива, для которого нужно очистить метку (если фильтр может иметь несколько значений)
   */
  clearFilterByChips(
    filterType: 'search' | 'date' | 'selectedEmployeeIds',
    arrayItem?: any
  ) {
    if (Array.isArray(this.filterValue[filterType])) {
      const matchedArr: any[] = this.filterValue[filterType] as any[];
      (this.filterValue[filterType] as any[]) = matchedArr.filter(
        (item) => item !== arrayItem
      );
    } else if (typeof this.filterValue[filterType] === 'string') {
      (this.filterValue[filterType] as string) = '';
    } else if (this.filterValue[filterType] instanceof Date) {
      switch (filterType) {
        case 'date':
          (this.filterValue[filterType] as Date) = new Date();
          break;
      }
    }
    this.applySearchFilter();
  }

  onSelectedDateChange(date: Date): void {
    if (sameDate(date, this.filterValue.date)) return;
    this.changeFilterDate(date);
    this.setQueryUrl({ ...this.filterValue });
  }

  changeFilterDate(date: Date): void {
    this.filterValue.date = date;
    this.vacationsEmployeeMembersFacade.show({
      date: this.filterValue.date,
    });
  }

  changeFilterEmployees(ids: string[]): void {
    this.filterValue.selectedEmployeeIds = ids;
  }

  getEmployeesByFilter(employees: EmployeeInterface[]): EmployeeInterface[] {
    let result = employees;

    if (result?.length && this.filterValue.selectedEmployeeIds?.length) {
      result = result.filter((item) =>
        this.filterValue.selectedEmployeeIds.includes(item.employeeID)
      );
    }

    return this.sortEmployees(result);
  }

  applySorting(field: 'fullName' | 'vacationBegin'): void {
    this.sortField = field;
    this.ref.detectChanges();
  }

  private sortEmployees(employees: EmployeeInterface[]): EmployeeInterface[] {
    if (!employees?.length) return employees;

    return [...employees].sort((a, b) => {
      switch (this.sortField) {
        case 'fullName':
          return (a.fullName || '').localeCompare(b.fullName || '');
        case 'vacationBegin': {
          const hasDateA = !!a.vacation?.vacationBegin;
          const hasDateB = !!b.vacation?.vacationBegin;

          if (!hasDateA && !hasDateB) return 0;
          if (!hasDateA) return 1;
          if (!hasDateB) return -1;

          return (
            new Date(a.vacation.vacationBegin).getTime() -
            new Date(b.vacation.vacationBegin).getTime()
          );
        }
        default:
          return 0;
      }
    });
  }

  downloadById(id: string): void {
    this.vacationsEmployeeDownloadFacade.show({ id });
    this.isDownloadEmployeeReportInProgress$ = combineLoadings(
      this.vacationsEmployeeDownloadFacade.loading$()
    );
  }

  downloadSelected(): void {
    this.downloadFormat = 'pdf';
    this.vacationsEmployeeDownloadListFacade.show({
      ids: this.filterValue.selectedEmployeeIds?.length ? this.filterValue.selectedEmployeeIds : (this.vacationsEmployeeMembersFacade?.getData()?.map(item => item.employeeID) || []),
      date: this.filterValue.date,
      format: 'pdf',
    });
    this.isDownloadEmployeeReportsInProgress$ = combineLoadings(
      this.vacationsEmployeeDownloadListFacade.loading$()
    );
  }

  downloadSelectedXlsx(): void {
    this.downloadFormat = 'xlsx';
    this.vacationsEmployeeDownloadListFacade.show({
      ids: this.filterValue.selectedEmployeeIds,
      date: this.filterValue.date,
      format: 'xlsx',
    });
    this.isDownloadEmployeeReportsInProgress$ = combineLoadings(
      this.vacationsEmployeeDownloadListFacade.loading$()
    );
  }

  clearFilters(): void {
    this.filterValue = {
      useSkip: true,
      count: 15,
      date: new Date(),
      search: '',
      selectedEmployeeIds: [],
    };
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
        this.ref.detectChanges();
        this.removeFiltersDialogOutsideClickEventListener();
      };

      this.filtersDialogOutsideClickHandler =
        this.filterService.addClickOutsideFiltersDialogEventListener(blurCallback, {
          // (!!!) Вызов обработчика события 'click' глобального объекта window (где вызывается blurCallback)
          // происходит раньше, чем вызов обработчика toggleFilters, в котором происходит переключение булевой
          // переменной showFilters, отвечающей за отображение/скрытие диалогового окна с фильтрами,
          // поэтому добавляем CSS-класс кнопки вызова диалога с фильтрами в исключения (не вызываем blurCallback)
          // во избежание нарушения логики работы.
          exceptElementClasses: ['filter-icon-button'],
        });
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
      true
    );
  }

  isWeekend(date: any): boolean {
    if (date) {
      const parsedDate = toUnzonedDate(new Date(date.year, date.month, date.day));
      return parsedDate.getDay() === 0 || parsedDate.getDay() === 6;
    }
    return false;
  }

  /**
   * Ссылка на обработчик нажатия мимо (снаружи от) диалогового окна с фильтрами.
   * Инициализируется в методе onFiltersDialogOutsideClick.
   */
  private filtersDialogOutsideClickHandler: () => void;

  downloadReport(format: 'pdf' | 'xlsx' = 'pdf'): void {
    if (format === 'xlsx') this.downloadSelectedXlsx();
    if (format === 'pdf') this.downloadSelected();
  }
}
