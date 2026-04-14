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
  Type,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { AgreementsListSigningDialogComponent } from '@features/agreements/components/agreements-list-signing-dialog/agreements-list-signing-dialog.component';
import { AgreementsResultDialogComponent } from '@features/agreements/components/agreements-result-dialog/agreements-result-dialog.component';
import {
  AGREEMENT_DATA_CONFIG,
  AGREEMENT_ITEM_LAYOUT,
} from '@features/agreements/constants/agreements-data-config';
import { AgreementSigningFilesFacade } from '@features/agreements/facades/agreement-signing-files.facade';
import { AgreementSigningListFacade } from '@features/agreements/facades/agreement-signing-list.facade';
import {
  DocumentFilterInterface,
  DocumentListInterface,
  DocumentTypesInterface,
} from '@features/agreements/models/agreement.interface';
import {
  DocumentStateInterface,
  DocumentStatesInterface,
} from '@features/agreements/models/document-states.interface';
import { DocumentInterface } from '@features/agreements/models/document.interface';
import { DocumentApiService } from '@features/agreements/services/document-api.service';
import { ItemListBuilderInterface } from '@shared/components/item-list-builder/models/item-list-builder.interface';
import { LangFacade } from '@shared/features/lang/facades/lang.facade';
import { LangUtils } from '@shared/features/lang/utils/lang.utils';
import {
  BulkDocumentSigningMode,
  SignatureProviderInterface,
} from '@shared/features/signature-validation-form/models/providers.interface';
import { AbstractLocalValidationService } from '@shared/features/signature-validation-form/services/abstract-local-validation.service';
import { CryptoProToken } from '@shared/features/signature-validation-form/utils/local-services.token';
import { PageStorageInterface } from '@shared/interfaces/storage/page/page-storage.interface';
import { AppService } from '@shared/services/app.service';
import { FilterService } from '@shared/services/filter.service';
import { SignProvidersHelperService } from '@shared/services/helpers/sign-providers-helper.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { logDebug } from '@shared/utilits/logger';
import { clearSelection } from '@shared/utils/DOM/common';
import {
  FpcInputsInterface,
  FpcOptionListItemInterface,
} from '@wafpc/base/models/fpc.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { firstValueFrom, Observable, of, Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ProvidersChoiceComponent } from '@shared/features/signature-validation-form/components/providers-choice/providers-choice.component';
import {
  ProvidersAlias,
  SignatureValidationType,
} from '@shared/features/signature-validation-form/models/signature-validation-type.interface';
import { ERROR } from '@shared/features/signature-validation-form/constants/error';
import { SignatureValidation } from '@shared/features/signature-validation-form/constants/signature-validation';
import { AbstractValidationComponent } from '@shared/features/signature-validation-form/components/abstract-validation/abstract-validation.component';
import { SignatureResponseInterface } from '@shared/models/signature-response.interface';
import { SignatureValidationFormInterfaces } from '@shared/features/signature-validation-form/models/signature-validation-form.interfaces';
import { filterSuccessOnly } from '@shared/features/signature-validation-form/utils/filter-success-only.util';

const localServiceToken = new InjectionToken<AbstractLocalValidationService>(
  'localService',
);

const dynamicToken: string = CryptoProToken;

@Component({
    selector: 'app-agreements-list',
    templateUrl: './agreements-list.component.html',
    styleUrls: ['./agreements-list.component.scss'],
    providers: [
        {
            provide: localServiceToken,
            useExisting: dynamicToken,
        },
    ],
    standalone: false
})
export class AgreementsListComponent implements OnChanges, OnInit, OnDestroy {
  app: AppService = inject(AppService);

  localStorageService = inject(LocalStorageService);

  currentPageStorage: PageStorageInterface = this.app.storage.page.current;

  urlSegmentsSignal: WritableSignal<UrlSegment[]> =
    this.currentPageStorage.data.frontend.signal.urlSegments;

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

  activeTab: 'ALL_DOCUMENTS' | 'DOCUMENTS_TO_BE_SIGNED' =
    'DOCUMENTS_TO_BE_SIGNED';

  scrollContainerClassCss = '.scroll-main-container';

  dataConfig: ItemListBuilderInterface[] = [...AGREEMENT_DATA_CONFIG];

  dataLayout = AGREEMENT_ITEM_LAYOUT;

  /**
   * Доступно ли на данной странице массовое подписание документов при помощи какого-либо провайдера ЭЦП.
   */
  isMassSignAvailable: boolean = false;

  @Input() agreementsList: DocumentListInterface;

  @Input() documentTypesList: DocumentTypesInterface;

  /**
   * Количество документов со статусом "К подписанию" (количество документов на подпись) для текущего пользователя.
   */
  toBeSignedCount: WritableSignal<number> = signal(null);

  @Input() stateList: DocumentStatesInterface;

  /**
   * Статус "К подписанию".
   */
  toBeSignedStatus: DocumentStateInterface;

  @Output() filter = new EventEmitter();

  @Input() loading: boolean;

  @Input() title: string;

  @Input() providers: any;

  @Output() loadList = new EventEmitter();

  @Output()
  openDocumentDialog = new EventEmitter<DocumentInterface & { index: number }>();

  /* Поля для фильтрации (хитро украдено со страницы "Мои заявки" (issues-list-dashboard.component.ts ^_^) */
  searchTextCopy;

  showFilters = false;

  timeoutId;

  statusList = [];

  filterValue: DocumentFilterInterface = {
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

  private dialogRef: DynamicDialogRef;

  destroy$ = new Subject<void>();

  private submit$ = new Subject<
    SignatureValidationFormInterfaces | typeof ERROR
  >();

  constructor(
    // Angular
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,

    // API
    private documentAPI: DocumentApiService,

    // PrimeNG
    private dialog: DialogService,

    // Other
    private filterService: FilterService,
    public langUtils: LangUtils,
    public langFacade: LangFacade,
    private signProvidersHelper: SignProvidersHelperService,
    private agreementSigningListFacade: AgreementSigningListFacade,
    @Inject(localServiceToken)
    private localService: AbstractLocalValidationService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.stateList?.currentValue) {
      const toBeSignedStatus = this.stateList.documentsStates.find(
        (s) => s.name === 'К подписанию',
      );
      if (toBeSignedStatus) this.toBeSignedStatus = toBeSignedStatus;
      this.addSubscriptions();
      this.initFilters();
    }

    if (changes?.agreementsList?.currentValue) {
      this.agreementsList.documents = this.agreementsList.documents.map(
        (v) => ({ ...v, iconName: 'icon-doc' }),
      );
    }

    if (changes?.providers?.currentValue) {
      const providers: SignatureProviderInterface[] =
        changes.providers.currentValue.signProviders || [];

      const massSignProviders: SignatureProviderInterface[] = providers.filter(
        (p) => p.ui.bulkDocumentSigning,
      );

      const firstUrlSegmentPath: string = this.urlSegmentsSignal()?.[0]?.path; // например: 'my-documents' или 'documents'

      const massSignModesForPage: BulkDocumentSigningMode[] =
        this.signProvidersHelper.getAvailableMassSignModesForPage(
          firstUrlSegmentPath,
        );

      const matchedMassSignProviders = massSignProviders.filter((p) =>
        massSignModesForPage.includes(p.ui.bulkDocumentSigningMode),
      );

      this.isMassSignAvailable = !!matchedMassSignProviders.length;

      if (
        this.isMassSignAvailable &&
        this.dataConfig.findIndex((item) => item.type === 'checkbox') === -1
      ) {
        this.addCheckbox();
      }
    }
  }

  ngOnInit(): void {
    this.initFilters();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next(null);
  }

  private addSubscriptions(): void {
    this.getToBeSignedDocumentsSubscription();
  }

  /**
   * Получаем документы со статусом "К подписанию".
   */
  getToBeSignedDocumentsSubscription(): void {
    if (!this.toBeSignedStatus || !this.toBeSignedStatus.id) return;
    const currentEmployeeId: string =
      this.localStorageService.getCurrentEmployeeId();
    if (!currentEmployeeId) {
      logDebug('Failed to get currentEmployeeId from localStorage!');
      return;
    }

    const filter = {
      state: [this.toBeSignedStatus?.id],
      searchTarget: ['name'],
      forEmployee: ['TITLE_MY_DOCUMENTS'].includes(this.title)
        ? 'true'
        : 'false',
      useSkip: true,
    };

    this.subscription.add(
      this.documentAPI
        .getDocumentList({ currentEmployeeId, filterData: filter })
        .subscribe((documentsToBeSigned) => {
          this.toBeSignedCount.set(documentsToBeSigned.count);
          const { queryParams } = this.route.snapshot;
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

  handleOpenDocument(document: DocumentInterface & { index: number }): void {
    this.openDocumentDialog.emit(document);
  }

  async signList(data: {
    selectedDocuments: DocumentInterface[];
    reject: boolean;
  }): Promise<void> {
    this.agreementSigningListFacade.show([]);
    const issueIds = data.selectedDocuments.filter(item => item.fileOwner === 'issue').map((item) => item.fileID);
    const agreementIds = data.selectedDocuments.filter(item => item.fileOwner === 'agreement').map((item) => item.fileID);


    const providers: SignatureProviderInterface[] =
      this.providers.signProviders || [];

    const massSignProviders: SignatureProviderInterface[] = providers.filter(
      (p) => p.ui.bulkDocumentSigning,
    );

    const firstUrlSegmentPath: string = this.urlSegmentsSignal()?.[0]?.path; // например: 'my-documents' или 'documents'

    const massSignModesForPage: BulkDocumentSigningMode[] =
      this.signProvidersHelper.getAvailableMassSignModesForPage(
        firstUrlSegmentPath,
      );

    const matchedMassSignProviders = massSignProviders.filter((p) =>
      massSignModesForPage.includes(p.ui.bulkDocumentSigningMode),
    );

    if (matchedMassSignProviders && matchedMassSignProviders.length > 0) {
      this.dialogRef = this.dialog.open(ProvidersChoiceComponent, {
        closable: true,
        dismissableMask: true,
        data: {
          providers: matchedMassSignProviders,
          forEmployee: firstUrlSegmentPath === 'my-documents',
        },
      });
      this.dialogRef.onClose
        .pipe(take(1), takeUntil(this.destroy$))
        .subscribe((provider: SignatureProviderInterface | undefined) => {
          if (provider) {
            const localSigning = provider.metadata.confirmMethod === 'local';
            this.signListDialog(
              provider,
              data.selectedDocuments,
              localSigning,
            );
          }
        });
    }
    let issuesList = [];
    let agreementList = [];

    if (issueIds.length) {
      issuesList = await firstValueFrom(
        this.documentAPI.getAgreementsIssueFilesList(issueIds, 'issue')
      );
    }

    if (agreementIds.length) {
      agreementList = await firstValueFrom(
        this.documentAPI.getAgreementsIssueFilesList(agreementIds, 'agreement')
      );
    }

    this.agreementSigningListFacade.show([...issuesList, ...agreementList]);
  }

  signListDialog(
    provider: SignatureProviderInterface,
    selectedDocuments: DocumentInterface[],
    localSigning: boolean,
  ): void {
    const dialogRef = this.dialog.open(AgreementsListSigningDialogComponent, {
      closable: true,
      dismissableMask: true,
      header: this.langUtils.convert(
        this.langFacade.getLang(),
        'SIGNING_FILES',
      ),
      data: {
        providerId: provider.metadata.id,
        providerSignType: provider.metadata.signType,
        localSigning,
        documents: selectedDocuments,
      },
    });

    dialogRef.onClose.pipe(take(1)).subscribe((result) => {
      // массив результатов
      if (result && result.error) {
        this.dialog
          .open(AgreementsResultDialogComponent, {
            closable: true,
            dismissableMask: true,
            header: this.langUtils.convert(
              this.langFacade.getLang(),
              'SIGNING_FILES',
            ),
            data: {
              results: result.items,
              tasks: selectedDocuments,
              success: false,
            },
          })
          .onClose.pipe(take(1))
          .subscribe(() => {
            window.location.reload();
          });
      } else if (result) {
        const res = result;
        const selectedProvider = this.providers.signProviders.find(
          (prov) => prov.metadata.id === provider.metadata.id,
        );
        const confirmMethod: SignatureValidationType =
          selectedProvider?.metadata?.confirmMethod;

        if (res !== ERROR) {
          /**
           * Условие, при котором не отображаем диалог о подписании/выпуске подписи при нажатии на кнопку
           * "Подписать" (за ненадобностью, либо по причине того, что он появится автоматически при поступлении
           * соответствующего уведомления [как в случае SMS-подписания]).
           */
          const dontShowSignDialog: boolean =
            confirmMethod === ProvidersAlias.confirmByOtherApp ||
            confirmMethod === ProvidersAlias.confirm ||
            confirmMethod === ProvidersAlias.local ||
            ((confirmMethod === ProvidersAlias.smsSigningOnly ||
              confirmMethod === ProvidersAlias.sms ||
              confirmMethod === ProvidersAlias.emailSigningIssueRelease ||
              confirmMethod === ProvidersAlias.smsSigningIssueRelease) &&
              !res.displayConfirmationCodeWindow);

          if (dontShowSignDialog) {
            this.openResultDialog();
          } else {
            const signatureValidation =
              SignatureValidation[
                selectedProvider?.metadata?.confirmMethod ??
                  ProvidersAlias.createNew
              ];
            return this.openComponentDialog({
              type: signatureValidation.type,
              provider: selectedProvider,
              response: result,
              fileInfo: selectedDocuments[0],
              forEmployee: true,
            });
          }
        }
      }
    });
  }

  openResultDialog(): void {
    this.dialog
      .open(AgreementsResultDialogComponent, {
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

  /* Фильтрация хитро украдена со страницы "Мои заявки" (issues-list-dashboard.component.ts) ^_^ */

  initFilters(): void {
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
        logDebug('Failed to parse documentsType from queryParams');
      }
    } else {
      this.selectedType = undefined;
    }

    if (
      this.activeTab === 'DOCUMENTS_TO_BE_SIGNED' &&
      !this.filterValue.state &&
      this.toBeSignedStatus?.id
    ) {
      this.filterValue.state = this.toBeSignedStatus.id;
    }
  }

  onLoadList(param: DocumentFilterInterface = this.filterValue): void {
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

  setQueryUrl(queryParams: Record<string, any>): void {
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: '',
      })
      .then(() => {});
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
          if (this.toBeSignedStatus?.id) {
            this.filterValue.state = this.toBeSignedStatus.id;
          }
          if (
            this.isMassSignAvailable &&
            this.dataConfig.findIndex((item) => item.type === 'checkbox') === -1
          ) {
            this.addCheckbox();
          }
          break;
        case 'ALL_DOCUMENTS':
          this.removeCheckbox();
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

  applyFilters(selectedType?: {
    documentsTypeID: string;
    documentsTypeName: string;
    documentsTypeValues: string;
  }): void {
    this.selectedType = selectedType;
    this.onLoadList();
  }

  clearFilters(): void {
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
    return this.stateList.documentsStates.find((state) => state.id === statusId)
      .name;
  }

  clearFilterByChips(
    filterType: 'search' | 'days' | 'state' | 'documentsType',
  ): void {
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

  addCheckbox(): void {
    this.dataConfig = [
      ...AGREEMENT_DATA_CONFIG,
      {
        type: 'checkbox',
        name: 'checkbox',
        class: ['custom-align'],
      },
    ];
  }

  removeCheckbox(): void {
    this.dataConfig = [...AGREEMENT_DATA_CONFIG];
  }

  /**
   * Ссылка на обработчик нажатия мимо (снаружи от) диалогового окна с фильтрами.
   * Инициализируется в методе onFiltersDialogOutsideClick.
   */
  private filtersDialogOutsideClickHandler: () => void;

  private openComponentDialog(data: {
    type: Type<AbstractValidationComponent>;
    provider: SignatureProviderInterface;
    response?: SignatureResponseInterface | typeof ERROR;
    fileInfo?: { fileID: string; fileOwner: string; file64?: string };
    forEmployee?: boolean;
  }): Observable<{ signInfo?: SignatureValidationFormInterfaces }> {
    if (!data.type) {
      return of({});
    }

    this.dialogRef = this.dialog.open(data.type, {
      closable: true,
      dismissableMask: true,
      data: {
        response: data.response,
        provider: data.provider,
        forEmployee: data.forEmployee,
        fileInfo: data.fileInfo,
        submit$: this.submit$,
        signatureEnable: true,
      },
    });

    this.dialogRef.onClose
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(() => {
        // this.openResultDialog();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });

    return this.submit$
      .asObservable()
      .pipe(filterSuccessOnly(), takeUntil(this.destroy$)) as Observable<{
      signInfo?: SignatureValidationFormInterfaces;
    }>;
  }
}
