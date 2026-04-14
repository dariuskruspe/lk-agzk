import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  Inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '@features/main/utils/breadcrumb-provider.utils';
import { LangFacade } from '@shared/features/lang/facades/lang.facade';
import { AppService } from '@shared/services/app.service';
import { CustomDialogService } from '@shared/services/dialog.service';
import { FilterService } from '@shared/services/filter.service';
import {
  Preloader,
  providePreloader,
} from '@shared/services/preloader.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProgressBar } from 'primeng/progressbar';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import {
  SURVEYS_MANAGEMENT_DATA_CONFIG,
  SURVEYS_MANAGEMENT_ITEM_LAYOUT,
} from '@features/surveys-management/constants/surveys-management-data-config';
import { AgreementsEmployeeInterface } from '@features/agreements-employee/models/agreement-employee.interface';
import { ItemListBuilderInterface } from '@shared/components/item-list-builder/models/item-list-builder.interface';
import { AgreementsEmployeeDocumentStateInterface } from '@features/agreements-employee/models/agreements-employee-document-state.interface';
import { SurveysManagementService } from '@features/surveys-management/sevices/surveys-management.service';
import { FpcOptionListItemInterface } from '@wafpc/base/models/fpc.interface';
import { LangUtils } from '@shared/features/lang/utils/lang.utils';
import {
  OptionListSurveyInterface,
  SurveyFilterParamsInterface,
  SurveysListInterface
} from '@features/surveys-management/models/surveys-management.interface';

@Component({
    selector: 'app-surveys-management-container',
    templateUrl: './surveys-management-container.component.html',
    styleUrls: ['./surveys-management-container.component.scss'],
    providers: [
        providePreloader(ProgressBar),
        {
            provide: DialogService,
            useClass: CustomDialogService,
        },
        provideBreadcrumb('TITLE_SURVEYS_MANAGEMENT', 0),
    ],
    standalone: false
})
export class SurveysManagementContainerComponent
  implements OnInit, AfterViewInit
{
  app: AppService = inject(AppService);

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  loading$ = new BehaviorSubject<boolean>(false);

  searchTextCopy;

  timeoutId: ReturnType<typeof setTimeout>;

  filterValue:  SurveyFilterParamsInterface = {
    useSkip: true,
    count: 15,
    page: 1,
  };

  dataLayout = SURVEYS_MANAGEMENT_ITEM_LAYOUT;

  dataConfig: ItemListBuilderInterface[] = [...SURVEYS_MANAGEMENT_DATA_CONFIG];

  agreementsEmployeeList: AgreementsEmployeeInterface = {
    count: 0,
    documents: [],
  };

  surveyList: SurveysListInterface;

  stateList: AgreementsEmployeeDocumentStateInterface;

  activeTab: 'ALL_SURVEYS' | 'SURVEYS_APPROVAL' | 'MY_SURVEYS' | 'ARCHIVE' = 'ALL_SURVEYS';

  currentPage = 1;

  creationAvailable = false;

  showFilters = false;

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

  employeesList: OptionListSurveyInterface;

  stateOptionList: OptionListSurveyInterface;

  constructor(
    private ref: ChangeDetectorRef,
    private filterService: FilterService,
    private surveysManagementService: SurveysManagementService,
    public dialog: DialogService,
    private preloader: Preloader,
    private langFacade: LangFacade,
    private route: ActivatedRoute,
    private router: Router,
    public langUtils: LangUtils,
    @Inject(BREADCRUMB) private _: unknown,
  ) {}

  async ngOnInit(): Promise<void> {
    this.initFilters();
    this.loading$.next(true);
    this.preloader.setCondition(this.loading$);
    this.getSurveyStates().then(() => {
      this.getSurveyList(this.filterValue).then(() => {
        if (this.filterValue.search) {
          this.applySearchFilter();
        }
      });
    });
    this.employeesList = await firstValueFrom(this.surveysManagementService.getOptions('surveyAuthors'));
    this.stateOptionList = await firstValueFrom(this.surveysManagementService.getOptions('surveyStates'));
  }

  ngAfterViewInit(): void {}

  initFilters() {
    const { queryParams } = this.route.snapshot;

    this.filterValue = {
      count: queryParams.count || 15,
      page: queryParams.page || 1,
      useSkip: queryParams.useSkip === 'true' || false,
    };
    if (queryParams.search) {
      this.filterValue.search = queryParams.search;
    }
    if (queryParams.type) {
      this.filterValue.type = queryParams.type;
    }
    if (queryParams.days) {
      this.filterValue.days = queryParams.days;
    }
    if (queryParams.state) {
      this.filterValue.state = queryParams.state.split(',');
    }
    if (queryParams.author) {
      this.filterValue.author = queryParams.author.split(',');
    }
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

  applyFilters(): void {
    if (!this.filterValue.search || this.searchTextCopy === this.filterValue.search) {
      this.getSurveyList(this.filterValue).then(() => {
        this.applySearchFilter();
      });
    } else {
      this.applySearchFilter();
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.cleanEmptyProps(this.filterValue),
      queryParamsHandling: '',
    });
  }

  applySearchFilter(): void {
    if (this.searchTextCopy !== this.filterValue.search && this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.searchTextCopy = this.filterValue.search;
    this.timeoutId = setTimeout(() => {
      const filteredValue = this.filterValue.search ? this.surveyList.surveys.filter(sur => sur.name.toLowerCase().includes(this.filterValue.search.toLowerCase())) : [...this.surveyList.surveys];
      this.setAgreementsEmployeeList({...this.surveyList, surveys: filteredValue});
      this.ref.detectChanges();
    }, 1000);
    this.ref.detectChanges();
  }

  /**
   * Очищаем метки (chips — "чипы") фильтров.
   *
   * @param filterType тип фильтра
   * @param arrayItem (необязательный параметр) конкретный элемент массива, для которого нужно очистить метку (если фильтр может иметь несколько значений)
   */
  clearFilterByChips(
    filterType: 'search' | 'type' | 'days' | 'state' | 'author',
    arrayItem?: string,
  ) {
      switch (filterType) {
        case 'search':
          this.filterValue.search = '';
          break;
        case 'type':
          delete this.filterValue.type;
          break;
        case 'days':
          delete this.filterValue.days;
          break;
        case 'state':
          this.filterValue.state = this.filterValue.state.filter(st => st !== arrayItem);
          break;
        case 'author':
          this.filterValue.author = this.filterValue.author.filter(st => st !== arrayItem);
          break;
      }
    this.applyFilters();
  }

  onLoadList(param: SurveyFilterParamsInterface): void {
    if (param.page && +param.page !== this.currentPage) {
      this.currentPage = +param.page;
      this.getSurveyList({...this.filterValue, ...param}).then(() => {});
    }
  }

  handleOpenDocument(data: any) {
    const role =
      this.activeTab === 'SURVEYS_APPROVAL' ? 'coordinator' : 'manager';
    this.router
      .navigate(['surveys-management', data.id], {
        queryParams: {
          role,
        },
      })
      .then();
  }

  async getSurveyList(param: SurveyFilterParamsInterface): Promise<void> {
    // const state =
    //   this.activeTab === 'SURVEYS_APPROVAL'
    //     ? this.stateList.documentsStates.find(
    //         (stateItem) => stateItem.alias === 'onSurveyApproval',
    //       ).id
    //     : undefined;
    let role;
    let section;
    switch (this.activeTab) {
      case 'SURVEYS_APPROVAL':
        role = 'coordinator';
        break;
      case 'ALL_SURVEYS':
        role = 'manager';
        section = 'general';
        break;
      case 'MY_SURVEYS':
        role = 'manager';
        section = 'mySurveys';
        break;
      case 'ARCHIVE':
        role = 'manager';
        section = 'archive';
        break;
    }
    const params = {...this.filterValue, ...param};
    const list = await firstValueFrom(
      this.surveysManagementService.getSurveys(role, params, section),
    );
    this.surveyList = list;
    this.creationAvailable = !!list.creationAvailable;
    this.setAgreementsEmployeeList(list);
    this.loading$.next(false);
  }

  async getSurveyStates(): Promise<void> {
    const states = await firstValueFrom(
      this.surveysManagementService.getSurveyStates(),
    );
    this.stateList = {
      documentsStates: states.states.map((state) => {
        return {
          id: state.stateID,
          name: state.name,
          color: state.color,
          sign: false,
          buttonCaption: '',
          alias: state.alias,
        };
      }),
    };
  }

  changeTab(tabName: 'ALL_SURVEYS' | 'SURVEYS_APPROVAL' | 'MY_SURVEYS' | 'ARCHIVE'): void {
    if (this.activeTab !== tabName) {
      this.loading$.next(true);
      this.activeTab = tabName;
      this.getSurveyList({ count: 15, page: 1, useSkip: false }).then(() => {});
    }
  }

  setAgreementsEmployeeList(list: SurveysListInterface) {
    this.agreementsEmployeeList = {
      count: list.count,
      documents: list.surveys.map((survey) => {
        return {
          fileID: survey.surveyID,
          state: survey.state,
          id: survey.surveyID,
          fileName: survey.name,
          name: survey.name,
          employeeName: ' ',
          fileOwner: 'issue',
          stateDate: new Date(survey.endDate).toISOString(),
          mandatory: true,
          refuseSignatureEnabled: false,
          iconName: 'pi pi-pen-to-square',
        };
      }),
    };
  }

  getStateNameById(id: string): string {
    return this.stateList.documentsStates.find(state => state.id === id).name
  }

  getAuthorNameById(id: string): string {
    return this.employeesList.optionList.find(empl => empl.value === id).representation;
  }

  getAnonName(id: 'anonymous' | 'nonAnonymous'): string {
    if (id === 'anonymous') {
      return this.langUtils.convert(
        this.langFacade.getLang(),
        'ANONYMOUS',
      );
    } else {
      return this.langUtils.convert(
        this.langFacade.getLang(),
        'NON_ANONYMOUS',
      );
    }
  }

  getPeriodNameByValue(value: string): string {
    return this.daysValueList.find(period => period.value === value).title;
  }
}
