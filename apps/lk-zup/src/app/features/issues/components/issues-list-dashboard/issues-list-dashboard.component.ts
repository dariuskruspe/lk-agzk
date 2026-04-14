import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IssuesTypesInterface,
  IssueTypes,
} from '@features/issues/models/issues-types.interface';
import { FpcOptionListItemInterface } from '@root/libs/form-page-constructor/projects/base/models/fpc.interface';
import { ItemListBuilderInterface } from '@shared/components/item-list-builder/models/item-list-builder.interface';
import { LangFacade } from '@shared/features/lang/facades/lang.facade';
import { LangUtils } from '@shared/features/lang/utils/lang.utils';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { UserSettingsInterface } from '@shared/models/menu-condition.interface';
import { AppService } from '@shared/services/app.service';
import {
  ISSUE_DATA_CONFIG,
  ISSUE_ITEM_LAYOUT,
} from '../../constants/issue-data-config';
import {
  IssuesInterface,
  IssuesListFormFilterValueInterface,
  IssuesListInterface,
  IssuesStatusInterface,
} from '../../models/issues.interface';

@Component({
    selector: 'app-issues-list-dashboard',
    templateUrl: './issues-list-dashboard.component.html',
    styleUrls: ['./issues-list-dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class IssuesListDashboardComponent implements OnInit, AfterViewInit {
  app: AppService = inject(AppService);

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  settingsSignal: WritableSignal<SettingsInterface> =
    this.app.storage.settings.data.frontend.signal.globalSettings;

  userSettingsSignal: WritableSignal<UserSettingsInterface> =
    this.app.userSettingsSignal;

  settingsStorage = this.app.storage.settings;

  themeSignal = this.settingsStorage.data.frontend.signal.theme;

  dataConfig: ItemListBuilderInterface[] = ISSUE_DATA_CONFIG;

  readonly dataTemplate = ISSUE_ITEM_LAYOUT;

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

  activeTab: 'applicant' | 'other_employee' = 'applicant';

  scrollContainerClassCss = '.scroll-main-container';

  @Input() issuesList: IssuesListInterface;

  @Input() issuesOtherEmployeeList: IssuesListInterface;

  @Input() issuesStatusList: IssuesStatusInterface;

  @Input() loading: boolean;

  @Input() userSettings: UserSettingsInterface;

  @Input() loadingOtherEmployeeIssues: boolean;

  @Input() scrollPosition: number;

  @Output() saveScrollPosition = new EventEmitter();

  @Output() loadList = new EventEmitter();

  @Output() loadOtherEmployeeList = new EventEmitter();

  @Output() goDetails = new EventEmitter();

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

  searchTextCopy: string;

  showFilters = false;

  timeoutId: undefined | ReturnType<typeof setTimeout>;

  filterValue: IssuesListFormFilterValueInterface = {
    useSkip: true,
    count: 15,
    page: 1,
    search: '',
    type: [],
  };

  constructor(
    public langUtils: LangUtils,
    public langFacade: LangFacade,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
  ) {}

  async ngOnInit(): Promise<void> {
    const { queryParams } = this.route.snapshot;

    if (queryParams.tab) {
      this.activeTab =
        queryParams.tab === 'applicant' ? 'applicant' : 'other_employee';
    }

    this.filterValue = {
      search: queryParams.search ? decodeURI(queryParams.search) : '',
      useSkip: true,
      count: 15,
      page: queryParams.page || 1,
      days: queryParams.days || null,
      state: queryParams.state || null,
      type: queryParams.type ? queryParams.type.split(',') : [],
    };
  }

  ngAfterViewInit(): void {
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

  onGoDetails(issue: { IssueID: string }): void {
    this.goDetails.emit(issue.IssueID);
  }

  onLoadList(param: IssuesListFormFilterValueInterface): void {
    const fullParams = {
      // если параметра page нет – задаём 1
      page: param.page || 1,
      ...this.filterValue,
      ...param,
      type: Array.isArray(param.type) ? param.type.join(',') : param.type,
    };

    const queryParams = this.cleanEmptyProps(fullParams);
    this.setQueryUrl(queryParams);
    this.loadList.emit(queryParams);
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

  onLoadOtherEmployeeList(param: IssuesListFormFilterValueInterface): void {
    const fullParams = {
      page: param.page || 1,
      ...this.filterValue,
      ...param,
      type: Array.isArray(param.type) ? param.type.join(',') : param.type,
    };

    const queryParams = this.cleanEmptyProps(fullParams);
    this.setQueryUrl(queryParams);
    this.loadOtherEmployeeList.emit(queryParams);
  }

  highlight(issue: IssuesInterface): boolean {
    return !!issue.taskID;
  }

  changeTab(tabName: 'applicant' | 'other_employee'): void {
    if (this.activeTab !== tabName) {
      this.activeTab = tabName;

      this.clearFilters(false);

      this.router.navigate([], { queryParams: {} });
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
    const filters = this.cleanEmptyProps(this.filterValue);
    if (this.activeTab === 'other_employee') {
      this.onLoadOtherEmployeeList(filters);
    } else {
      this.onLoadList(filters);
    }
  }

  clearFilters(apply = true): void {
    this.filterValue = {
      useSkip: true,
      count: 15,
      page: 1,
      search: '',
      type: [],
    };

    // выполняем запрос только если явно нужно
    if (apply) {
      this.applyFilters();
    }
  }

  getPeriodTitleByValue(value: string): string {
    return this.daysValueList.find((day) => day.value === value).title;
  }

  getStatusTitleByValue(statusId: string): string {
    return this.issuesStatusList?.states?.find((state) => state.id === statusId)
      ?.name;
  }

  getTypeTitleByValue(typeId: string): string {
    return !typeId || !this.issuesTypes.length
      ? ''
      : this.issuesTypes.find((type) => type.issueTypeID === typeId)
          .issueTypeShortName;
  }

  clearFilterByChips(
    filterType: 'search' | 'days' | 'state' | 'type',
    typeId?: string,
  ): void {
    if (filterType === 'type') {
      const index = this.filterValue[filterType].findIndex(
        (type) => type === typeId,
      );
      this.filterValue[filterType].splice(index, 1);
    } else {
      this.filterValue[filterType] = '';
    }
    this.applySearchFilter();
  }
}
