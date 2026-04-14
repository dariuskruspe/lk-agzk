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
import {
  AgreementsEmployeeDocumentStateInterface,
  AgreementsEmployeeDocumentStateItemInterface,
} from '@features/agreements-employee/models/agreements-employee-document-state.interface';
import { SurveysManagementService } from '@features/surveys-management/sevices/surveys-management.service';
import { SurveyFilterParamsInterface } from '@features/surveys-management/models/surveys-management.interface';

@Component({
    selector: 'app-surveys-employee-container',
    templateUrl: './surveys-employee-container.component.html',
    styleUrls: ['./surveys-employee-container.component.scss'],
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
export class SurveysEmployeeContainerComponent
  implements OnInit, AfterViewInit
{
  app: AppService = inject(AppService);

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  loading$ = new BehaviorSubject<boolean>(false);

  searchTextCopy;

  timeoutId: ReturnType<typeof setTimeout>;

  filterValue: any = {
    useSkip: true,
    count: 15,
    page: 1,
    search: '',
  };

  dataLayout = SURVEYS_MANAGEMENT_ITEM_LAYOUT;

  dataConfig: ItemListBuilderInterface[] = [...SURVEYS_MANAGEMENT_DATA_CONFIG];

  agreementsEmployeeList: AgreementsEmployeeInterface = {
    count: 0,
    documents: [],
  };

  stateList: AgreementsEmployeeDocumentStateInterface;

  currentPage = 1;

  activeTab: 'SURVEYS' | 'ARCHIVE' = 'SURVEYS';

  constructor(
    private ref: ChangeDetectorRef,
    private filterService: FilterService,
    private surveysManagementService: SurveysManagementService,
    public dialog: DialogService,
    private preloader: Preloader,
    private langFacade: LangFacade,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(BREADCRUMB) private _: unknown,
  ) {}

  ngOnInit(): void {
    this.initFilters();
    this.loading$.next(true);
    this.preloader.setCondition(this.loading$);
    this.getSurveyStates().then(() => {
      this.getSurveyList(this.filterValue).then(() => {});
    });
  }

  ngAfterViewInit(): void {}

  initFilters() {
    const { queryParams } = this.route.snapshot;
    this.filterValue = {
      count: 15,
      page: queryParams.page || 1,
      search: queryParams.search ? decodeURI(queryParams.search) : '',
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
  }

  /**
   * Очищаем метки (chips — "чипы") фильтров.
   *
   * @param filterType тип фильтра
   * @param arrayItem (необязательный параметр) конкретный элемент массива, для которого нужно очистить метку (если фильтр может иметь несколько значений)
   */
  clearFilterByChips(
    filterType: 'search' | 'date' | 'selectedEmployeeIds',
    arrayItem?: any,
  ) {
    if (Array.isArray(this.filterValue[filterType])) {
      const matchedArr: any[] = this.filterValue[filterType] as any[];
      (this.filterValue[filterType] as any[]) = matchedArr.filter(
        (item) => item !== arrayItem,
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

  onLoadList(param: SurveyFilterParamsInterface): void {
    if (+param.page !== this.currentPage) {
      this.currentPage = +param.page;
      this.getSurveyList(param).then(() => {});
    }
  }

  handleOpenDocument(data: any) {
    if (this.isCompletedSurvey(data.state, this.stateList.documentsStates)) {
      return;
    }
    this.router.navigate(['surveys-employee', data.id]).then();
  }

  isCompletedSurvey(
    surveySate: string,
    states: AgreementsEmployeeDocumentStateItemInterface[],
  ): boolean {
    const state = states.find((stateItem) => stateItem.id === surveySate);
    return state.alias === 'completed';
  }

  async getSurveyList(param: SurveyFilterParamsInterface): Promise<void> {
    let section;
    switch (this.activeTab) {
      case 'SURVEYS':
        section = 'general';
        break;
      case 'ARCHIVE':
        section = 'archive';
        break;
    }
    const list = await firstValueFrom(
      this.surveysManagementService.getSurveys('employee', param, section),
    );
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

  changeTab(tabName: 'SURVEYS' | 'ARCHIVE'): void {
    if (this.activeTab !== tabName) {
      this.loading$.next(true);
      this.activeTab = tabName;
      this.getSurveyList({ count: 15, page: 1, useSkip: true }).then(() => {});
    }
  }
}
