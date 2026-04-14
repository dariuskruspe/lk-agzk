import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DocumentStateFacade } from '@features/agreements/facades/document-state-facade.service';
import {
  DocumentInterface,
  GetDocumentParamsInterface,
} from '@features/agreements/models/document.interface';
import { DocumentService } from '@features/agreements/services/document.service';
import { DocumentApiService } from '@features/agreements/services/document-api.service';
import {
  DocumentFilterInterface,
  DocumentListInterface,
} from '@features/agreements/models/agreement.interface';
import { DocumentStateInterface } from '@features/agreements/models/document-states.interface';
import { BreadcrumbsService } from '@features/main/services/breadcrumbs.service';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '@features/main/utils/breadcrumb-provider.utils';
import { UserStorageInterface } from '@shared/interfaces/storage/user/user-storage.interface';
import { AppService } from '@shared/services/app.service';
import {
  Preloader,
  providePreloader,
} from '@shared/services/preloader.service';
import { ProgressBar } from 'primeng/progressbar';
import { SignRoles } from '@shared/features/signature-file/models/sign-roles.enum';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { firstValueFrom } from 'rxjs';
import { filter as rxFilter, take } from 'rxjs/operators';

@Component({
  selector: 'app-document-container',
  templateUrl: './document-container.component.html',
  styleUrls: ['./document-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideBreadcrumb('SHOW_DOCUMENT_PAGE', 1),
    providePreloader(ProgressBar),
  ],
  standalone: false,
})
export class DocumentContainerComponent implements OnInit, OnDestroy {
  app: AppService = inject(AppService);

  currentUserStorage: UserStorageInterface = this.app.storage.user.current;

  openDocumentSignal: WritableSignal<DocumentInterface> =
    this.currentUserStorage.data.frontend.signal.openDocument;

  openDocumentFileUint8ArraySignal: WritableSignal<Uint8Array> =
    this.currentUserStorage.data.frontend.signal.openDocumentFileUint8Array;

  // Локальный сигнал для хранения документов для навигации
  private nextDocument = signal<DocumentInterface | null>(null);

  // Сигнал для отслеживания загрузки документов для навигации
  isLoadingNextDocuments = signal(false);

  currentPage = signal(1);

  maxPage = signal<number | null>(null);

  private wasDocumentSigned = signal(false);

  showNextButton = signal(false);

  constructor(
    // Angular
    private route: ActivatedRoute,
    private router: Router,

    // Data
    private documentService: DocumentService,
    private documentApiService: DocumentApiService,
    private localStorageService: LocalStorageService,
    private documentStateFacade: DocumentStateFacade,

    // Other
    @Inject(BREADCRUMB) private _: unknown,
    private breadcrumbs: BreadcrumbsService,
    private preloader: Preloader,
  ) {
    this.preloader.setCondition(
      toObservable(this.documentService.isDocumentLoadingSignal),
    );
  }

  async ngOnInit(): Promise<void> {
    const page = this.route.snapshot.queryParams['page'];
    if (page) {
      this.currentPage.set(parseInt(page));
    }
    const section = this.getSection();
    if (section === 'documents') {
      this.showNextButton.set(true);
    }
    await this.loadDocument();
    if (this.showNextButton()) {
      await this.loadNextDocuments();
    }
  }

  async loadDocument(): Promise<void> {
    const routeParams: Params = this.route.snapshot.params;

    const section = this.getSection();
    const docParams: GetDocumentParamsInterface = {
      id: routeParams.id,
      fileOwner: routeParams.owner,
      forEmployee: this.router.url.split('/')[1] !== 'documents',
    };

    switch (section) {
      case 'documents':
        docParams.role = SignRoles.org;
        break;
      case 'documents-employee':
      case 'issues-management':
        docParams.role = SignRoles.manager;
        break;
      default:
        docParams.role = SignRoles.employee;
    }

    await this.documentService.getDocumentHandler(docParams);
    await this.documentService.getDocumentFileHandler();
  }

  private async loadNextDocuments(): Promise<void> {
    const routeParams: Params = this.route.snapshot.params;
    const currentDocumentId = routeParams['id'];
    const fileOwner = routeParams['owner'];

    if (!currentDocumentId || !fileOwner) {
      return;
    }

    this.isLoadingNextDocuments.set(true);

    try {
      const currentEmployeeId = this.localStorageService.getCurrentEmployeeId();

      if (!currentEmployeeId) {
        return;
      }

      let toBeSignedStatus: DocumentStateInterface | undefined = undefined;

      if (this.route.snapshot.queryParams['state']) {
        // Получаем статус "К подписанию" из DocumentStateFacade
        // Если данных еще нет, загружаем их
        let stateList = this.documentStateFacade.getData();
        if (
          !stateList ||
          !stateList.documentsStates ||
          stateList.documentsStates.length === 0
        ) {
          this.documentStateFacade.getState();
          // Ждем загрузки данных
          stateList = await firstValueFrom(
            this.documentStateFacade.forcedData$.pipe(
              rxFilter(
                (data) =>
                  !!data &&
                  !!data.documentsStates &&
                  data.documentsStates.length > 0,
              ),
              take(1),
            ),
          );
        }

        toBeSignedStatus = stateList?.documentsStates?.find(
          (s) => s.name === 'К подписанию',
        );

        if (!toBeSignedStatus || !toBeSignedStatus.id) {
          this.nextDocument.set(null);
          return;
        }
      }

      const nextPage = this.maxPage() && this.currentPage() >= this.maxPage()
        ? 1
        : this.wasDocumentSigned() ? this.currentPage() : this.currentPage() + 1;

      // Определяем параметры фильтрации в зависимости от секции
      // Используем массив для state, как в AgreementsListComponent
      const filter: DocumentFilterInterface = {
        page: nextPage,
        count: 1, // Запрашиваем 2 документа
        useSkip: true,
        searchTarget: ['name'],
        role: SignRoles.org,
        forEmployee: 'false',
      };

      if (toBeSignedStatus) {
        filter.state = toBeSignedStatus.id;
      }

      // Запрашиваем список документов к подписанию
      let data: DocumentListInterface | null = null;
      data = await firstValueFrom(
        this.documentApiService.getDocumentList({
          currentEmployeeId,
          filterData: filter,
        }),
      );

      this.maxPage.set(data?.count || 1);

      if (
        !data ||
        !data.documents ||
        data.documents.length === 0 ||
        this.currentPage() >= this.maxPage()
      ) {
        this.currentPage.set(0);
        filter.page = 1;
        data = await firstValueFrom(
          this.documentApiService.getDocumentList({
            currentEmployeeId,
            filterData: filter,
          }),
        );
        this.maxPage.set(data?.count || 1);
      }

      if (data && data.documents && data.documents.length > 0) {
        this.nextDocument.set(data.documents.shift());
      } else {
        this.nextDocument.set(null);
      }
    } catch (error) {
      console.error('Ошибка при загрузке следующих документов:', error);
      this.nextDocument.set(null);
    } finally {
      this.isLoadingNextDocuments.set(false);
    }
  }

  private getSection(): string {
    return this.router.url.split('/')[1].split('?')[0];
  }

  async navigateToNextDocument(): Promise<void> {
    const nextDoc = this.nextDocument();

    if (!nextDoc) {
      return;
    }

    const section = this.getSection();
    // Если документ был подписан, не увеличиваем currentPage,
    const nextPage = this.wasDocumentSigned()
      ? this.currentPage()
      : this.currentPage() + 1;

    this.wasDocumentSigned.set(false);

    let url = `/${section}/${nextDoc.fileOwner}/${nextDoc.id}?page=${nextPage}`;
    if (this.route.snapshot.queryParams['state']) {
      url += `&state=${this.route.snapshot.queryParams['state']}`;
    }
    this.currentPage.set(nextPage);
    await this.router.navigateByUrl(url);

    // Перезагружаем документ и следующие документы
    await this.loadDocument();
    await this.loadNextDocuments();
  }

  backPage(): void {
    this.breadcrumbs.goBack();
  }

  closeFile(result: unknown): void {
    if (result) {
      this.wasDocumentSigned.set(true);
      this.ngOnInit().then(() => {});
    }
  }

  ngOnDestroy(): void {
    this.openDocumentSignal.set(null);
    this.openDocumentFileUint8ArraySignal.set(null);
  }
}
