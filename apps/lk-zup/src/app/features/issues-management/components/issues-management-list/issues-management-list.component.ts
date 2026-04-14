import {
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
import { ActivatedRoute, Router } from '@angular/router';
import {
  EmployeesSubordinatesInterface,
  EmployeesSubordinatesItem,
} from '@features/employees/models/employees-subordinates.interface';
import {
  ISSUE_MANAGEMENT_APPROVE_DATA_CONFIG
} from '@features/issues-management/constants/issue-management-approve-data-config';
import {
  ISSUE_MANAGEMENT_DATA_CONFIG,
  ISSUE_MANAGMENT_ITEM_LAYOUT,
} from '@features/issues-management/constants/issue-management-data-config';
import { IssuesTypesInterface, IssueTypes } from '@features/issues/models/issues-types.interface';
import { IssuesStatusInterface } from '@features/issues/models/issues.interface';
import { ItemListBuilderInterface } from '@shared/components/item-list-builder/models/item-list-builder.interface';
import { LangFacade } from '@shared/features/lang/facades/lang.facade';
import { LangUtils } from '@shared/features/lang/utils/lang.utils';
import { AppService } from '@shared/services/app.service';
import { FilterService } from '@shared/services/filter.service';
import { clearSelection } from '@shared/utils/DOM/common';
import { FpcOptionListItemInterface } from '@wafpc/base/models/fpc.interface';
import { DialogService } from 'primeng/dynamicdialog';
import { take } from 'rxjs/operators';
import {
  IssuesManagementFilterInterface,
  IssuesManagementInterfaces,
  IssuesManagementListInterfaces,
} from '../../models/issues-management-list.interfaces';
import { IssuesManagementDialogComponent } from '../issues-managment-dialog/issues-management-dialog.component';

@Component({
    selector: 'app-issues-management-list',
    templateUrl: './issues-management-list.component.html',
    styleUrls: ['./issues-management-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class IssuesManagementListComponent implements OnInit, OnChanges {
  app: AppService = inject(AppService);

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

  dataConfig: ItemListBuilderInterface[] = ISSUE_MANAGEMENT_DATA_CONFIG;

  dataConfigToApprove: ItemListBuilderInterface[] =
    ISSUE_MANAGEMENT_APPROVE_DATA_CONFIG;

  dataLayout = ISSUE_MANAGMENT_ITEM_LAYOUT;


  cashedIssuesList: IssuesManagementInterfaces;

  scrollContainerClassCss = '.scroll-main-container';

  @Input() issuesManagementData$: IssuesManagementInterfaces;

  @Input() issuesManagementDataToApprove: IssuesManagementInterfaces;

  @Input() issuesManagementData: IssuesManagementInterfaces;

  @Input() issuesStatusList: IssuesStatusInterface;

  @Input() employeesSubordinates: EmployeesSubordinatesInterface;

  @Input() issuesLoading: boolean;

  @Input() set issueTypesList(value: IssuesTypesInterface) {
    this.issuesTypes = [];
    value?.issueTypeGroups.forEach((group) => {
      this.issuesTypes.push(...group.issueTypes);
    });

    this.issuesTypes.sort((type1, type2) => {
      if (type1.issueTypeFullName < type2.issueTypeFullName) {
        return -1;
      }
      if (type1.issueTypeFullName > type2.issueTypeFullName) {
        return 1;
      }
      return 0;
    });
  }

  issuesTypes: IssueTypes[] = [];

  @Output() loadList = new EventEmitter();

  @Output() loadListToApprove = new EventEmitter();

  @Output() issueDetails = new EventEmitter();

  activeTab: 'ISSUES_TO_BE_APPROVED' | 'ALL_ISSUES' = 'ISSUES_TO_BE_APPROVED';

  searchText: string;

  searchTextCopy: string;

  showFilters = false;

  employee: {
    value: string;
    title: string;
  };

  types: string[] = [];

  period: {
    value: string;
    title: string;
  };

  employeesSubordinatesList: {
    value: string;
    title: string;
  }[] = [];

  statusList = [];

  status: {
    value: string;
    title: string;
  };

  timeoutId;

  /**
   * Количество заявок со статусом "На согласовании" (количество заявок, которые необходимо согласовать) для текущего пользователя.
   */
  toBeApprovedCount: WritableSignal<number> = signal(null);

  constructor(
    // Angular
    private ref: ChangeDetectorRef,
    private router: Router,

    // PrimeNG
    public dialogService: DialogService,

    // Other
    private filterService: FilterService,
    public langUtils: LangUtils,
    public langFacade: LangFacade,
    private route: ActivatedRoute,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.issuesManagementData$?.currentValue) {
      this.cashedIssuesList = this.issuesManagementData$;
    }

    if (changes?.issuesManagementDataToApprove) {
      if (
        !changes.issuesManagementDataToApprove.firstChange &&
        changes.issuesManagementDataToApprove.previousValue === null
      ) {
        const toBeApprovedCount: number =
          this.issuesManagementDataToApprove?.count;
        this.toBeApprovedCount.set(toBeApprovedCount);
        if (toBeApprovedCount === 0) {
          this.goToTab('ALL_ISSUES');
        }
      }
    }

    if (changes?.employeesSubordinates?.currentValue) {
      this.employeesSubordinatesList = this.employeesSubordinates?.subordinates.map(
        (e: EmployeesSubordinatesItem) => {
          return {title: e.fullName, value: e.employeeID};
        },
      );
    }

    if (changes?.issuesStatusList?.currentValue) {
      this.statusList = this.issuesStatusList?.states.map((status) => {
        return {title: status.name, value: status.id};
      });
    }
  }

  ngOnInit(): void {
    this.cashedIssuesList = this.issuesManagementData;
    const { queryParams } = this.route.snapshot;

    if (queryParams.tab) {
      this.activeTab =
        queryParams.tab.toUpperCase() === 'ALL_ISSUES'
          ? 'ALL_ISSUES'
          : 'ISSUES_TO_BE_APPROVED';
    }

    this.searchText = queryParams.search ? decodeURI(queryParams.search) : null;
    this.employee = queryParams.employee
      ? { value: queryParams.employee, title: this.getEmployeeTitleById(queryParams.employee) }
      : null;
    this.types = queryParams.type ? queryParams.type.split(',') : [];
    this.period = queryParams.days
      ? { value: queryParams.days, title: this.getPeriodTitleByValue(queryParams.days) }
      : null;
    this.status = queryParams.state
      ? { value: queryParams.state, title: this.getStatusTitleByValue(queryParams.state) }
      : null;

    // Применение фильтров сразу после инициализации
    this.applyFilters();
  }

  goToTab(tab: 'ALL_ISSUES' | 'ISSUES_TO_BE_APPROVED'): void {
    this.activeTab = tab;
    this.clearFilters();
    this.applyFilters();
  }

  onIssueDetails(issue: { IssueID: string }): void {
    this.issueDetails.emit(issue.IssueID);
  }

  onLoadList(param: IssuesManagementFilterInterface): void {
    this.loadList.emit({
      ...param,
      search: this.searchText,
      days: this.period,
      state: this.status,
      employee: this.employee?.value,
      page: param.page || 1,
    });
  }

  onLoadListApproving(param: IssuesManagementFilterInterface): void {
    this.loadListToApprove.emit(param);
  }

  applyFilters(): void {
    // Строка, содержащая id-шники (uuid-шки) выбранных типов заявок, разделённых запятыми
    const type: string = Array.isArray(this.types)
      ? this.types.join(',')
      : this.types;

    const queryParams: Record<string, any> = {
      tab: this.activeTab,
      search: this.searchText,
      employee: this.employee?.value,
      type: type,
      days: this.period?.value,
      state: this.status?.value,
      page: 1,
    };

    for (const key in queryParams) {
      if (queryParams[key] === null || queryParams[key] === undefined || queryParams[key] === '') {
        delete queryParams[key];
      }
    }

    this.router.navigate([], { queryParams, queryParamsHandling: 'merge' });

    if (this.activeTab === 'ALL_ISSUES') {
      this.loadList.emit({
        search: this.searchText,
        days: this.period?.value,
        state: this.status?.value,
        employee: this.employee?.value,
        useSkip: true,
        count: 15,
        type,
        page: 1,
      });
    } else {
      this.loadListToApprove.emit({
        search: this.searchText,
        days: this.period?.value,
        employee: this.employee?.value,
        type,
      });
    }
  }

  applySearchFilter(): void {
    if (this.searchTextCopy !== this.searchText && this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.searchTextCopy = this.searchText;
    this.timeoutId = setTimeout(() => {
      this.applyFilters();
    }, 1000);
  }

  highlight(issue: IssuesManagementListInterfaces): boolean {
    return !!issue.taskID;
  }

  approveList(data: {
    selectedDocuments: IssuesManagementListInterfaces[];
    reject: boolean;
  }): void {
    const dialog = this.dialogService.open(IssuesManagementDialogComponent, {
      data: {
        result: false,
        issues: data.selectedDocuments,
        reject: data.reject,
      },
      header: this.langUtils.convert(
        this.langFacade.getLang(),
        'TITLE_EMAIL_APPROVAL',
      ),
      closable: true,
      dismissableMask: true,
    });
    dialog.onClose.pipe(take(1)).subscribe((result) => {
      if (result && result.error) {
        setTimeout(() => {
          const ref = this.dialogService.open(IssuesManagementDialogComponent, {
            data: {
              success: false,
              result: true,
              reject: data.reject,
              issues: data.selectedDocuments,
              results: result.results,
              statusList: this.issuesStatusList.states,
            },
            header: this.langUtils.convert(
              this.langFacade.getLang(),
              'TITLE_EMAIL_APPROVAL',
            ),
            closable: true,
            dismissableMask: true,
          });

          ref?.onClose.pipe(take(1)).subscribe(() => {
            window.location.reload();
          });
        }, 1000);
      } else if (result) {
        setTimeout(() => {
          const ref = this.dialogService.open(IssuesManagementDialogComponent, {
            data: {
              success: true,
              reject: !result.approve,
            },
            header: this.langUtils.convert(
              this.langFacade.getLang(),
              'TITLE_EMAIL_APPROVAL',
            ),
            closable: true,
            dismissableMask: true,
          });

          ref?.onClose.pipe(take(1)).subscribe(() => {
            window.location.reload();
          });
        }, 1000);
      }
    });
  }

  changeTab(tabName: 'ISSUES_TO_BE_APPROVED' | 'ALL_ISSUES'): void {
    if (this.activeTab !== tabName) {
      this.activeTab = tabName;
      this.router
        .navigate([], {
          queryParams: { tab: tabName },
          queryParamsHandling: 'merge',
        })
        .then(() => {
          this.applyFilters();
        });
    }
  }

  clearFilters(): void {
    this.status = null;
    this.searchText = null;
    this.employee = null;
    this.period = null;
    this.types = [];

    const queryParams: Record<string, any> = { tab: this.activeTab };

    this.router.navigate([], { queryParams, queryParamsHandling: 'merge' });
  }

  clearSearchByChip(): void {
    this.searchText = null;
    this.applyFilters();
  }

  clearEmployeeByChip(): void {
    this.employee = null;
    this.applyFilters();
  }

  clearPeriodByChip(): void {
    this.period = null;
    this.applyFilters();
  }

  clearTypeByChip(typeId: string): void {
    const index = this.types.findIndex((type) => type === typeId);
    this.types.splice(index, 1);
    this.applyFilters();
  }

  clearStatusByChip(): void {
    this.status = null;
    this.applyFilters();
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
        this.filterService.addClickOutsideFiltersDialogEventListener(
          blurCallback,
          {
            // (!!!) Вызов обработчика события 'click' глобального объекта window (где вызывается blurCallback)
            // происходит раньше, чем вызов обработчика toggleFilters, в котором происходит переключение булевой
            // переменной showFilters, отвечающей за отображение/скрытие диалогового окна с фильтрами,
            // поэтому добавляем CSS-класс кнопки вызова диалога с фильтрами в исключения (не вызываем blurCallback)
            // во избежание нарушения логики работы.
            exceptElementClasses: ['filter-icon-button'],
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

  getTypeTitleByValue(typeId: string): string {
    return !typeId || !this.issuesTypes.length
      ? ''
      : this.issuesTypes.find((type) => type.issueTypeID === typeId)
          .issueTypeShortName;
  }

  /**
   * Ссылка на обработчик нажатия мимо (снаружи от) диалогового окна с фильтрами.
   * Инициализируется в методе onFiltersDialogOutsideClick.
   */
  private filtersDialogOutsideClickHandler: () => void;

  getEmployeeTitleById(employeeID: string): string {
    return this.employeesSubordinatesList?.find((e) => e.value === employeeID)?.title || '';
  }

  getPeriodTitleByValue(value: string): string {
    return this.daysValueList.find((day) => day.value === value)?.title || '';
  }

  getStatusTitleByValue(statusId: string): string {
    return this.statusList?.find((status) => status.value === statusId)?.title || '';
  }
}
