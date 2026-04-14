import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Inject,
  InjectionToken,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  signal,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgreementsEmployeeResultDialogComponent } from '@features/agreements-employee/components/agreements-employee-result-dialog/agreements-employee-result-dialog.component';
import { ItemListBuilderInterface } from '@shared/components/item-list-builder/models/item-list-builder.interface';
import { LangFacade } from '@shared/features/lang/facades/lang.facade';
import { LangUtils } from '@shared/features/lang/utils/lang.utils';
import { SignatureProviderInterface } from '@shared/features/signature-validation-form/models/providers.interface';
import { AbstractLocalValidationService } from '@shared/features/signature-validation-form/services/abstract-local-validation.service';
import { CryptoProToken } from '@shared/features/signature-validation-form/utils/local-services.token';
import { FilterService } from '@shared/services/filter.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { clearSelection } from '@shared/utils/DOM/common';
import {
  FpcInputsInterface,
  FpcOptionListItemInterface,
} from '@wafpc/base/models/fpc.interface';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AgreementsEmployeeListSigningDialogComponent } from '../../components/agreements-employee-list-signing-dialog/agreements-employee-list-signing-dialog.component';
import {
  AGREEMENT_EMPLOYEE_DATA_CONFIG,
  AGREEMENT_EMPLOYEE_ITEM_LAYOUT,
} from '../../constants/agreements-employee-data-config';
import { AgreementEmployeeSigningFilesFacade } from '../../facades/agreement-employee-signing-files.facade';
import { AgreementEmployeeSigningListFacade } from '../../facades/agreement-employee-signing-list.facade';
import { AgreementEmployeeDocumentPageInterface } from '../../models/agreement-employee-document-page.interface';
import {
  AgreementEmployeeDocumentTypesInterface,
  AgreementEmployeeFilterInterface,
  AgreementsEmployeeInterface,
} from '../../models/agreement-employee.interface';
import {
  AgreementsEmployeeDocumentStateInterface,
  AgreementsEmployeeDocumentStateItemInterface,
} from '../../models/agreements-employee-document-state.interface';
import { AgreementsEmployeeService } from '../../services/agreements-employee.service';
import { SignRoles } from '@shared/features/signature-file/models/sign-roles.enum';

const localServiceToken = new InjectionToken<AbstractLocalValidationService>(
  'localService',
);

const dynamicToken: string = CryptoProToken;

@Component({
  selector: 'app-agreements-employee-list',
  templateUrl: './agreements-employee-list.component.html',
  styleUrls: ['./agreements-employee-list.component.scss'],
  providers: [
    {
      provide: localServiceToken,
      useExisting: dynamicToken,
    },
  ],
  standalone: false,
})
export class AgreementsEmployeeListComponent
  implements OnChanges, OnInit, OnDestroy
{
  agreementsEmployeeService = inject(AgreementsEmployeeService);

  localStorageService = inject(LocalStorageService);

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

  filterInputs: FpcInputsInterface[] = [
    {
      type: 'text',
      formControlName: 'search',
      label: this.langUtils.convert(
        this.langFacade.getLang(),
        'ISSUE_SEARCH_FIELD',
      ),
      placeholder: '',
      gridClasses: ['col-lg-4', 'com-md-12'],
      validations: [],
      icon: { name: 'clear', clearMode: true },
      edited: true,
    },
    {
      type: 'select',
      formControlName: 'state',
      label: this.langUtils.convert(
        this.langFacade.getLang(),
        'PROFILE_SIGN_STATUS',
      ),
      gridClasses: ['col-lg-4', 'com-md-12'],
      selectMultiple: true,
      validations: [],
      edited: true,
      optionList: [],
    },
    {
      type: 'select',
      formControlName: 'days',
      label: this.langUtils.convert(this.langFacade.getLang(), 'PERIOD'),
      gridClasses: ['col-lg-4', 'com-md-12'],
      validations: [],
      edited: true,
      selectMultiple: false,
      optionList: this.daysValueList,
    },
  ];

  filterConfig = null; // отключаем старые фильтры
  // filterConfig: FpcInterface = {
  //   options: {
  //     changeStrategy: 'push',
  //     appearanceElements: 'outline',
  //     editMode: true,
  //     viewMode: 'edit',
  //     submitDebounceTime: 1000,
  //   },
  //   template: this.filterInputs,
  // };

  activeTab: 'ALL_DOCUMENTS' | 'DOCUMENTS_TO_BE_SIGNED' =
    'DOCUMENTS_TO_BE_SIGNED';

  scrollContainerClassCss = '.scroll-main-container';

  dataConfig: ItemListBuilderInterface[] = [...AGREEMENT_EMPLOYEE_DATA_CONFIG];

  dataLayout = AGREEMENT_EMPLOYEE_ITEM_LAYOUT;

  enableMassSign = false;

  @Input() agreementsEmployeeList: AgreementsEmployeeInterface;

  @Input() documentTypesList: AgreementEmployeeDocumentTypesInterface;

  /**
   * Количество документов со статусом "К подписанию" (количество документов на подпись) для текущего пользователя.
   */
  toBeSignedCount: WritableSignal<number> = signal(null);

  @Input() stateList: AgreementsEmployeeDocumentStateInterface;

  /**
   * Статус "К подписанию".
   */
  toBeSignedStatuses: AgreementsEmployeeDocumentStateItemInterface[];

  @Output() filter = new EventEmitter();

  @Input() loading: boolean;

  @Input() title: string;

  @Input() providers: any;

  @Output() loadList = new EventEmitter();

  @Output()
  openAgreementEmployeeDocumentDialog =
    new EventEmitter<AgreementEmployeeDocumentPageInterface>();

  /* Поля для фильтрации (хитро украдено со страницы "Мои заявки" (issues-list-dashboard.component.ts ^_^) */
  searchTextCopy;

  showFilters = false;

  timeoutId;

  statusList = [];

  filterValue: AgreementEmployeeFilterInterface = {
    useSkip: true,
    count: 15,
    page: 1,
    days: '',
    search: '',
    state: '',
    documentsType: '',
  };

  selectedType: {
    documentsTypeID: string;
    documentsTypeName: string;
    documentsTypeValues: string;
  };

  subscription: Subscription = new Subscription();

  constructor(
    // Angular
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,

    // PrimeNG
    private dialog: DialogService,

    // Other
    private filterService: FilterService,
    public langUtils: LangUtils,
    public langFacade: LangFacade,
    private agreementEmployeeSigningListFacade: AgreementEmployeeSigningListFacade,
    @Inject(localServiceToken)
    private localService: AbstractLocalValidationService,
    public agreementEmployeeSigningFilesFacade: AgreementEmployeeSigningFilesFacade,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.stateList?.currentValue) {
      const toBeSignedStatuses = this.stateList.documentsStates.filter(
        (s) => s.name === 'К подписанию' || s.name.includes('К подписанию исп'),
      );
      if (toBeSignedStatuses) this.toBeSignedStatuses = toBeSignedStatuses;
      this.addSubscriptions();
      this.initFilters();
      const stateList = [];
      for (const state of this.stateList.documentsStates) {
        stateList.push({
          title: state.name,
          value: state.id,
        });
      }
      this.filterInputs.find((e) => {
        return e.formControlName === 'state';
      }).optionList = stateList;
    }

    if (changes?.agreementsList?.currentValue) {
      this.agreementsEmployeeList.documents =
        this.agreementsEmployeeList.documents.map((v) => ({
          ...v,
          iconName: 'icon-doc',
        }));
    }
    if (changes?.providers?.currentValue) {
      if (this.title === 'SIGNED_DOCUMENTS') {
        const provider = changes?.providers?.currentValue.signProviders.find(
          (prov) => {
            return prov.metadata.app === 'CryptoPro';
          },
        );
        this.enableMassSign = provider?.ui?.bulkDocumentSigning;

        if (
          this.enableMassSign &&
          this.dataConfig.findIndex((item) => item.type === 'checkbox') === -1
        ) {
          this.dataConfig = [
            ...this.dataConfig,
            {
              type: 'checkbox',
              name: 'checkbox',
              class: ['align-left'],
            },
          ];
        }
      }
    }
  }

  ngOnInit() {
    this.initFilters();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private addSubscriptions() {
    this.getToBeSignedDocumentsSubscription();
  }

  /**
   * Получаем документы со статусом "К подписанию".
   */
  getToBeSignedDocumentsSubscription() {
    const currentEmployeeId: string =
      this.localStorageService.getCurrentEmployeeId();
    if (!currentEmployeeId) {
      console.error('Failed to get currentEmployeeId from localStorage!');
      return;
    }

    const filter = {
      state: this.toBeSignedStatuses.map((status) => status.id),
      searchTarget: ['name'],
      forEmployee: ['TITLE_MY_DOCUMENTS'].includes(this.title)
        ? 'true'
        : 'false',
      useSkip: true,
      role: SignRoles.manager,
    };

    this.subscription.add(
      this.agreementsEmployeeService
        .getAgreementsEmployeeLists({ currentEmployeeId, filterData: filter })
        .subscribe((documentsToBeSigned) => {
          this.toBeSignedCount.set(documentsToBeSigned.count);
          if (
            this.activeTab === 'DOCUMENTS_TO_BE_SIGNED' &&
            !documentsToBeSigned.count
          ) {
            this.activeTab = 'ALL_DOCUMENTS';
            this.clearFilters();
            this.applyFilters();
          }
        }),
    );
  }

  handleOpenDocument(document: AgreementEmployeeDocumentPageInterface): void {
    this.openAgreementEmployeeDocumentDialog.emit(document);
  }

  signList(data: {
    selectedDocuments: AgreementEmployeeDocumentPageInterface[];
    reject: boolean;
  }): void {
    const ids = data.selectedDocuments.map((item) => item.fileID);
    this.agreementEmployeeSigningListFacade.show(ids);

    const provider: SignatureProviderInterface = this.providers.signProviders.find(
      (prov: SignatureProviderInterface) => {
        return prov.metadata.app === 'CryptoPro';
      },
    );
    const dialogRef = this.dialog.open(
      AgreementsEmployeeListSigningDialogComponent,
      {
        closable: true,
        dismissableMask: true,
        header: this.langUtils.convert(
          this.langFacade.getLang(),
          'SIGNING_FILES',
        ),
        data: {
          providerId: provider.metadata.id,
          providerSignType: provider.metadata.signType,
        },
      },
    );

    dialogRef.onClose.pipe(take(1)).subscribe((result) => {
      // тут будет массив результатов в items
      if (result && result.error) {
        this.dialog
          .open(AgreementsEmployeeResultDialogComponent, {
            closable: true,
            dismissableMask: true,
            header: this.langUtils.convert(
              this.langFacade.getLang(),
              'SIGNING_FILES',
            ),
            data: {
              results: result.items,
              tasks: data.selectedDocuments,
              success: false,
            },
          })
          .onClose.pipe(take(1))
          .subscribe(() => {
            window.location.reload();
          });
      } else if (result) {
        this.dialog
          .open(AgreementsEmployeeResultDialogComponent, {
            closable: true,
            dismissableMask: true,
            header: this.langUtils.convert(
              this.langFacade.getLang(),
              'SIGNING_FILES',
            ),
            data: {
              success: true,
            },
          })
          .onClose.pipe(take(1))
          .subscribe(() => {
            window.location.reload();
          });
      }
    });
  }

  /* Фильтрация хитро украдена со страницы "Мои заявки" (issues-list-dashboard.component.ts) ^_^ */

  initFilters() {
    const { queryParams } = this.route.snapshot;

    if (queryParams.tab) {
      this.activeTab =
        queryParams.tab === 'ALL_DOCUMENTS'
          ? 'ALL_DOCUMENTS'
          : 'DOCUMENTS_TO_BE_SIGNED';
    }

    this.filterValue = {
      search: queryParams.search ? decodeURI(queryParams.search) : '',
      useSkip: true,
      count: 15,
      page: queryParams.page || 1,
      days: queryParams.days || '',
      state: queryParams.state || '',
      documentsType: queryParams.documentsType || '',
    };

    if (queryParams.documentsType) {
      try {
        const parsed = JSON.parse(decodeURI(queryParams.documentsType));
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.selectedType = {
            documentsTypeID: parsed[0].typeId,
            documentsTypeName: parsed[0].typeName,
            documentsTypeValues: parsed[0].typeName,
          };
        }
      } catch (e) {
        console.error('Failed to parse documentsType from queryParams', e);
      }
    } else {
      this.selectedType = undefined;
    }

    if (
      this.activeTab === 'DOCUMENTS_TO_BE_SIGNED' &&
      !this.filterValue.state &&
      this.toBeSignedStatuses?.length
    ) {
      this.filterValue.state = this.toBeSignedStatuses.map(
        (status) => status.id,
      );
    }
  }

  onLoadList(param: AgreementEmployeeFilterInterface = this.filterValue): void {
    const fullParams: any = {
      ...this.filterValue,
      ...param,
      tab: this.activeTab,
    };
    if (this.selectedType) {
      fullParams.documentsType = JSON.stringify([
        {
          typeId: this.selectedType.documentsTypeID,
          typeName: this.selectedType.documentsTypeValues,
        },
      ]);
    } else {
      fullParams.documentsType = '';
    }
    const queryParams = this.cleanEmptyProps(fullParams);
    this.setQueryUrl(queryParams);
    this.loadList.emit(queryParams);
  }

  setQueryUrl(queryParams: Record<string, any>) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
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

  /**
   * Переходим на указанную вкладку.
   * @param tabName название вкладки
   * @param options (необязательный параметр) опции
   */
  changeTab(
    tabName: 'DOCUMENTS_TO_BE_SIGNED' | 'ALL_DOCUMENTS',
    options?: { force: boolean },
  ): void {
    if (this.activeTab !== tabName || options?.force) {
      this.activeTab = tabName;
      this.clearFilters();
      switch (tabName) {
        case 'DOCUMENTS_TO_BE_SIGNED':
          if (this.toBeSignedStatuses?.length) {
            this.filterValue.state = this.toBeSignedStatuses.map(
              (status) => status.id,
            );
          }
          break;
      }
      this.applyFilters();
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
    this.onLoadList();
  }

  clearFilters() {
    this.filterValue = {
      useSkip: true,
      count: 15,
      page: 1,
      days: '',
      search: '',
      state: '',
      documentsType: '',
    };
    this.selectedType = undefined;
  }

  getPeriodTitleByValue(value: string): string {
    return this.daysValueList.find((day) => day.value === value).title;
  }

  getStatusTitleByValue(statusId: string): string {
    return this.stateList.documentsStates.find((state) => state.id === statusId)?.name;
  }

  clearFilterByChips(
    filterType: 'search' | 'days' | 'state' | 'documentsType',
  ) {
    if (filterType === 'documentsType') {
      this.selectedType = undefined;
    }
    this.filterValue[filterType] = '';
    this.applySearchFilter();
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
}
