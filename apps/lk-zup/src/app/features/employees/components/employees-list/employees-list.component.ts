import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter, inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemListBuilderInterface } from '@shared/components/item-list-builder/models/item-list-builder.interface';
import { LangFacade } from '@shared/features/lang/facades/lang.facade';
import { LangUtils } from '@shared/features/lang/utils/lang.utils';
import {
  EMPLOYEES_DATA_CONFIG,
  EMPLOYEE_ITEM_LAYOUT,
} from '../../constants/employees-data-config';
import { EmployeesCompanyEmployeeListInterface } from '../../models/employees-company-employee-list.interface';
import {
  CompanyInterface,
  EmployeesCompaniesInterface,
  EmployeesCompanyDepartmentsInterface,
} from '../../models/employees-company.interface';
import {
  EmployeeStateListInterface,
  EmployeeStateListItemInterface,
  EmployeesListFormFilterValueInterface,
} from '../../models/employees.interface';
import { AppService } from "@shared/services/app.service";
import { OverlayOptions } from "primeng/api";
import { MultiSelect } from "primeng/multiselect";
import { DomHandler } from "primeng/dom";

@Component({
    selector: 'app-employees-list',
    templateUrl: './employees-list.component.html',
    styleUrls: ['./employees-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class EmployeesListComponent implements OnChanges {
  app: AppService = inject(AppService);

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  dataConfig: ItemListBuilderInterface[] = EMPLOYEES_DATA_CONFIG;

  dataLayout = EMPLOYEE_ITEM_LAYOUT;

  @Input() employeeList: EmployeesCompanyEmployeeListInterface;

  @Input() employeeStateList: EmployeeStateListInterface;

  @Input() employeeStateFilterList: EmployeeStateListInterface;

  @Input() employeesCompanyDepartments: EmployeesCompanyDepartmentsInterface[];

  @Input() employeesCompanies: EmployeesCompaniesInterface;

  @Input() loading: boolean;

  @Output() loadList = new EventEmitter();

  @Output() goDetails = new EventEmitter();

  /**
   * Общие (для всех фильтров) настройки отображения оверлеев.
   */
  overlayOptions: OverlayOptions | undefined = {
    contentStyle: {
      'max-width': '90vw',
    },
  };

  @ViewChild('departmentMultiselect') departmentMultiselect: MultiSelect;

  departmentFilterOverlayOptions: OverlayOptions | undefined;

  /**
   * Инициализируем параметры отображения оверлея (выпадающей панели) указанного фильтра.
   *
   * См. https://github.com/primefaces/primeng/issues/16011
   *
   * @param filterName название фильтра, для которого инициализируем параметры отображения оверлея
   */
  initFilterOverlayOptions(filterName: string): void {
    if (filterName === 'departmentMultiselect') {
      this.departmentFilterOverlayOptions = {
        ...this.overlayOptions,
        contentStyle: {
          'max-width': DomHandler.getOuterWidth(this.departmentMultiselect.el.nativeElement) + 'px',
        },
      };
    }
  }

  onDepartmentMultiselectPanelShow(): void {
    this.initFilterOverlayOptions('departmentMultiselect');
  }

  /* Поля для фильтрации (хитро украдено со страницы "Мои заявки" (issues-list-dashboard.component.ts ^_^) */
  searchTextCopy;

  showFilters = false;

  timeoutId;

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

  constructor(
    public langUtils: LangUtils,
    public langFacade: LangFacade,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.employeeStateList) {
      this.employeeStateList.employeesStates =
        this.employeeStateList.employeesStates.map((v) => ({
          ...v,
          color: '#989AA2',
        }));
    }
  }

  onGoDetails(employee: { id: string }): void {
    this.goDetails.emit(employee.id);
  }

  /* Фильтрация хитро украдена со страницы "Мои заявки" (issues-list-dashboard.component.ts) ^_^ */
  ngAfterViewInit() {
    const { queryParams } = this.route.snapshot;

    this.filterValue = {
      search: queryParams.search ? decodeURI(queryParams.search) : '',
      useSkip: true,
      count: 15,
      page: queryParams.page || 1,
      state: queryParams.state ? +queryParams.state : '',
      organizationID: queryParams.organizationID || '',
      departments: queryParams.departments?.split(',') || [],
      myDept: queryParams.myDept === "true" || false,
    };

    window.addEventListener('click', (event) => {
      const target: HTMLElement = event.target as HTMLElement;
      const filterDialog: HTMLElement =
        document.getElementById('filters-dialog');
      const pDropdownItemsWrapper: HTMLElement =
        document.getElementsByClassName(
          'p-dropdown-items-wrapper'
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

  onLoadList(param: EmployeesListFormFilterValueInterface): void {
    const fullParams = { ...this.filterValue, ...param };
    const queryParams = this.cleanEmptyProps(fullParams);
    this.setQueryUrl(queryParams);
    this.loadList.emit(queryParams);
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
    this.onLoadList(this.filterValue);
  }

  getOrganizationTitleByValue(organizationID: string): string {
    // Организация (компания)
    const organization: CompanyInterface =
      this.employeesCompanies?.organizations?.find(
        (company) => company.organizationID === organizationID
      );
    return organization?.name;
  }

  getDepartmentTitleByValue(departmentID: string): string {
    // Подразделение
    const department: EmployeesCompanyDepartmentsInterface =
      this.employeesCompanyDepartments?.find(
        (department) => department.ID === departmentID
      );
    return department?.name;
  }

  getStatusTitleByValue(statusCode: string): string {
    // Рабочий статус
    const employeeState: EmployeeStateListItemInterface =
      this.employeeStateList?.employeesStates?.find(
        (state) => state.code === statusCode
      );
    return employeeState?.name;
  }

  /**
   * Очищаем метки (chips — "чипы") фильтров.
   *
   * @param filterType тип фильтра
   * @param arrayItem (необязательный параметр) конкретный элемент массива, для которого нужно очистить метку (если фильтр может иметь несколько значений)
   */
  clearFilterByChips(
    filterType:
      | 'search'
      | 'state'
      | 'organizationID'
      | 'departments'
      | 'myDept',
    arrayItem?: any
  ) {
    if (Array.isArray(this.filterValue[filterType])) {
      const matchedArr: any[] = this.filterValue[filterType] as any[];
      (this.filterValue[filterType] as any[]) = matchedArr.filter(
        (item) => item !== arrayItem
      );
    } else if (typeof this.filterValue[filterType] === 'string' || typeof this.filterValue[filterType] === 'number') {
      (this.filterValue[filterType] as string) = '';
    } else if (typeof this.filterValue[filterType] === 'boolean') {
      switch (filterType) {
        case 'myDept':
          (this.filterValue[filterType] as boolean) = false;
          break;
      }
    }
    this.applySearchFilter();
  }
}
