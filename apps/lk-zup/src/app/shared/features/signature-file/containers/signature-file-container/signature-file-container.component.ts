import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DocumentStateFacade } from '@features/agreements/facades/document-state-facade.service';
import { DocumentStateInterface } from '@features/agreements/models/document-states.interface';
import {
  DocumentInterface,
  GetDocumentParamsInterface,
} from '@features/agreements/models/document.interface';
import { DocumentService } from '@features/agreements/services/document.service';
import { AgreementsStateUtils } from '@features/agreements/utils/agreements-state.utils';
import { SettingsFacade } from '@shared/features/settings/facades/settings.facade';
import { RefuseDialogComponent } from '@shared/features/signature-file/components/refuse-dialog/refuse-dialog.component';
import { ArchFileFacade } from '@shared/features/signature-file/facades/arch-file.facade';
import { DocForSignatureFacade } from '@shared/features/signature-file/facades/doc-for-signature.facade';
import { DocsSignFacade } from '@shared/features/signature-file/facades/doc-sign.facade';
import { DocumentLogsFileFacade } from '@shared/features/signature-file/facades/document-logs-file.facade';
import { ProvidersFacade } from '@shared/features/signature-validation-form/facades/providers.facade';
import { SignatureValidationService } from '@shared/features/signature-validation-form/services/signature-validation.service';
import { FileDataInterface } from '@shared/interfaces/file/file-data.interface';
import { UserStorageInterface } from '@shared/interfaces/storage/user/user-storage.interface';
import { AppService } from '@shared/services/app.service';
import { CustomDialogService } from '@shared/services/dialog.service';
import { FileDownloadService } from '@shared/services/file-download.service';
import { FilesService } from '@shared/services/files.service';
import { HrPortalBridgeService } from '@shared/services/hr-portal-bridge.service';
import { FileSanitizerClass } from '@shared/utilits/download-file.utils';
import { getFileBlobByData } from '@shared/utils/file/common';
import { pick } from 'lodash';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { SignRoles } from '@shared/features/signature-file/models/sign-roles.enum';
import { IssuesShowContainerComponent } from '@app/features/issues/containers/issues-show-container/issues-show-container.component';

@Component({
  selector: 'app-signature-file-container',
  templateUrl: './signature-file-container.component.html',
  styleUrls: ['./signature-file-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DialogService,
      useClass: CustomDialogService,
    },
  ],
  standalone: false,
})
export class SignatureFileContainerComponent implements OnDestroy, OnInit {
  app: AppService = inject(AppService);

  currentUserStorage: UserStorageInterface = this.app.storage.user.current;

  openDocumentSignal: WritableSignal<DocumentInterface> =
    this.currentUserStorage.data.frontend.signal.openDocument;

  openDocumentFileDataSignal: WritableSignal<FileDataInterface> =
    this.currentUserStorage.data.frontend.signal.openDocumentFileData;

  openDocumentFileUint8ArraySignal: WritableSignal<Uint8Array> =
    this.currentUserStorage.data.frontend.signal.openDocumentFileUint8Array;

  isDocumentFileLoadingSignal: WritableSignal<boolean> =
    this.currentUserStorage.data.frontend.signal.isDocumentFileLoading;

  // Локальные данные для модального режима (не влияют на глобальные сигналы)
  private modalDocument = signal<DocumentInterface | null>(null);
  private modalDocumentFileUint8Array = signal<Uint8Array | null>(null);
  private modalDocumentFileData = signal<FileDataInterface | null>(null);
  private isModalDocumentFileLoading = signal<boolean>(false);
  private modalOpenTimestamp = signal<number>(0);
  currentDocument = computed(() => {
    return this.isModalMode ? this.modalDocument() : this.openDocumentSignal();
  });

  currentDocumentFileUint8Array = computed(() => {
    // В модальном режиме используем только локальный файл (не глобальный)
    if (this.isModalMode) {
      if (this.isModalDocumentFileLoading()) {
        return null;
      }
      return this.modalDocumentFileUint8Array();
    }
    return this.openDocumentFileUint8ArraySignal();
  });

  currentDocumentFileData = computed(() => {
    return this.isModalMode
      ? this.modalDocumentFileData()
      : this.openDocumentFileDataSignal();
  });

  currentIsDocumentFileLoading = computed(() => {
    return this.isModalMode
      ? this.isModalDocumentFileLoading()
      : this.isDocumentFileLoadingSignal();
  });

  get isModalMode(): boolean {
    return !!this.config;
  }

  private hrPresentationBridge = inject(HrPortalBridgeService);
  private cdr = inject(ChangeDetectorRef);

  @Input() hasAgreement = false;

  forEmployee = true;
  @Input() showNextButton = false;
  @Input() hasNextDocument = false;
  @Input() isLoadingNext = false;
  @Output() navigateToNext = new EventEmitter<void>();

  @Output() onclose = new EventEmitter<unknown>();

  private destroy$ = new Subject<void>();

  constructor(
    private documentService: DocumentService,
    private fileSanitizer: FileSanitizerClass,
    public fileService: FilesService,
    public docForSignatureFacade: DocForSignatureFacade,
    @Optional() private config: DynamicDialogConfig,
    @Optional() public dialogRef: DynamicDialogRef,
    private signatureValidation: SignatureValidationService,
    private archFacade: ArchFileFacade,
    public docSignFacade: DocsSignFacade,
    private agreementDocumentStateFacade: DocumentStateFacade,
    private agreementsStateUtils: AgreementsStateUtils,
    public settingsFacade: SettingsFacade,
    private dialog: DialogService,
    public providersFacade: ProvidersFacade,
    public documentLogsFileFacade: DocumentLogsFileFacade,
    private fileDownloadService: FileDownloadService,
    private router: Router,
    private dialogService: DialogService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.forEmployee = !this.router.url.includes('/documents/');

    // Очищаем старые данные при открытии модального окна
    if (this.isModalMode) {
      this.modalOpenTimestamp.set(0);
      this.modalDocument.set(null);
      this.modalDocumentFileUint8Array.set(null);
      this.modalDocumentFileData.set(null);
      this.isModalDocumentFileLoading.set(false);
      this.cdr.markForCheck();

      await new Promise((resolve) => setTimeout(resolve, 0));

      this.modalOpenTimestamp.set(Date.now());
      this.cdr.markForCheck();
    }

    await this.loadDocument();
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    // Очищаем локальные данные для предотвращения использования старых данных при повторном открытии
    this.modalDocument.set(null);
    this.modalDocumentFileUint8Array.set(null);
    this.modalDocumentFileData.set(null);
    this.isModalDocumentFileLoading.set(false);
    if (this.isModalMode) {
      this.modalOpenTimestamp.set(0);
    }
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }

  async loadDocument(): Promise<void> {
    if (this.isModalMode) {
      const docData = this.config.data as DocumentInterface;
      if (!docData) return;

      this.config.header = docData.name;

      // Очищаем старые данные файла перед загрузкой нового
      this.modalDocumentFileUint8Array.set(null);
      this.modalDocumentFileData.set(null);
      this.isModalDocumentFileLoading.set(false);
      this.cdr.markForCheck();

      this.modalDocument.set(docData);

      // Сбрасываем timestamp и очищаем файл для принудительного пересоздания pdf-viewer
      this.modalOpenTimestamp.set(0);
      this.modalDocumentFileUint8Array.set(null);
      this.modalDocumentFileData.set(null);
      this.isModalDocumentFileLoading.set(true);
      this.cdr.markForCheck();

      await new Promise((resolve) => setTimeout(resolve, 0));

      if (!this.isModalDocumentFileLoading()) {
        return;
      }

      try {
        const docFileBlob = await firstValueFrom(
          this.fileService.getFileBlob(
            'file',
            docData.fileOwner,
            docData.fileID,
          ),
        );

        if (docFileBlob) {
          // Проверяем, что документ не изменился во время загрузки
          const currentDocBeforeLoad = this.modalDocument();
          if (!currentDocBeforeLoad || currentDocBeforeLoad.id !== docData.id) {
            this.isModalDocumentFileLoading.set(false);
            return;
          }

          const arrayBuffer = await docFileBlob.arrayBuffer();
          // Создаем копию для избежания проблем с кешированием
          const newFileUint8Array = new Uint8Array(arrayBuffer);

          const fileData: FileDataInterface = {
            content: {
              uint8Array: newFileUint8Array,
            },
            mimeType: docFileBlob.type,
            name: docData.fileName,
          };

          // Проверяем актуальность документа перед установкой файла
          const currentDoc = this.modalDocument();
          if (currentDoc && currentDoc.id === docData.id) {
            // Устанавливаем timestamp перед файлом для пересоздания pdf-viewer
            const fileTimestamp = Date.now();
            this.modalOpenTimestamp.set(fileTimestamp);

            this.isModalDocumentFileLoading.set(false);
            this.modalDocumentFileUint8Array.set(newFileUint8Array);
            this.modalDocumentFileData.set(fileData);
            this.cdr.markForCheck();
          } else {
            this.isModalDocumentFileLoading.set(false);
          }
        } else {
          this.isModalDocumentFileLoading.set(false);
          this.cdr.markForCheck();
        }
      } catch {
        this.isModalDocumentFileLoading.set(false);
        this.cdr.markForCheck();
      }
    } else {
      const docData: DocumentInterface = this.openDocumentSignal();
      if (!docData) return;

      const docParams: GetDocumentParamsInterface = pick(docData, [
        'id',
        'fileOwner',
        'forEmployee',
      ]) as GetDocumentParamsInterface;
      const section = this.getSection();

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

      if (
        !this.openDocumentSignal() ||
        this.openDocumentSignal().id !== docParams.id ||
        this.openDocumentSignal().state !== docData?.state
      ) {
        await this.documentService.getDocumentHandler(docParams);
      }

      const doc: DocumentInterface = this.openDocumentSignal();
      if (!doc) return;

      if (
        !this.isDocumentFileLoadingSignal() &&
        (!this.openDocumentFileDataSignal() ||
          this.openDocumentFileDataSignal().name !== doc.name)
      ) {
        await this.documentService.getDocumentFileHandler();
      }
    }
  }

  private getSection(): string {
    return this.router.url.split('/')[1].split('?')[0];
  }

  signing = signal(false);

  sign(): void {
    const doc: DocumentInterface = this.currentDocument();
    this.signing.set(true);
    this.signatureValidation
      .confirmAndSign({
        data: doc,
        facade: this.docSignFacade,
        signatureEnabled: this.isSignatureEnabled,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.signing.set(false);
          this.close(result);
        },
        error: () => {
          this.signing.set(false);
        },
        complete: () => {
          this.signing.set(false);
        },
      });
  }

  refuse(): void {
    const doc: DocumentInterface = this.currentDocument();
    const dialog = this.dialog.open(RefuseDialogComponent, {
      closable: true,
      dismissableMask: true,
      data: {
        refuseReasonList: doc.refuseReasonList,
      },
    });
    dialog.onClose
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          const doc: DocumentInterface = this.currentDocument();
          this.docSignFacade.sendForSignature({
            ...result,
            files: [
              {
                fileID: doc.fileID,
                owner: doc.fileOwner,
              },
            ],
            forEmployee: doc.forEmployee,
            currentRole: doc.currentRole,
          });

          this.docSignFacade
            .getSignatureResponse$()
            .pipe(take(1), takeUntil(this.destroy$))
            .subscribe(this.close.bind(this));
        }
      });
  }

  reworkPresentation() {
    const doc = this.currentDocument();
    this.hrPresentationBridge.startReviewPresentation(doc.targetPresentationId);
  }

  close(result?: unknown): void {
    if (!result) return;

    if (this.dialogRef) {
      this.dialogRef.close(result);
      return;
    }
    this.onclose.emit(result);
  }

  download(data: { type: string }): void {
    const doc: DocumentInterface = this.currentDocument();
    if (data.type === 'arch' || data.type === 'documentLogs') {
      this.archFacade.show({
        data: doc,
        forEmployee: this.forEmployee,
        type: data.type,
      });
    } else {
      const fileData: FileDataInterface = this.currentDocumentFileData();
      const safeResourceURL: SafeResourceUrl =
        this.fileSanitizer.markAsSafeResourceURL(
          URL.createObjectURL(getFileBlobByData(fileData)),
        );

      this.fileDownloadService
        .download(safeResourceURL, doc.fileName)
        .then(() => {});
    }
  }

  get isSignatureEnabled(): boolean {
    return this.settingsFacade.getData()?.general?.signatureValidation;
  }

  get isSignatureRequired(): boolean {
    const doc: DocumentInterface = this.currentDocument();
    if (!doc) return false;
    const hideSignButton = doc.isSignable === false;

    const docStateId: string = doc.state;
    const docState: DocumentStateInterface =
      this.findDocumentStateById(docStateId);

    if (!docState) return false;

    return !docState.sign && !hideSignButton;
  }

  get buttonCaption(): string {
    const doc: DocumentInterface = this.currentDocument();
    if (!doc) return '';

    const docStateId: string = doc.state;
    const docState: DocumentStateInterface =
      this.findDocumentStateById(docStateId);

    if (!docState) return '';

    return docState.buttonCaption ?? '';
  }

  get issueId(): string {
    const doc: DocumentInterface = this.currentDocument();
    if (!doc) return '';
    return doc.issueId || doc.issueID || '';
  }

  private findDocumentStateById(stateId: string): DocumentStateInterface {
    return this.agreementsStateUtils.getItem(
      this.agreementDocumentStateFacade.getData(),
      stateId,
    );
  }

  setDocViewed(): void {
    const doc: DocumentInterface = this.currentDocument();
    this.documentLogsFileFacade.show({
      ...doc,
      forEmployee: this.forEmployee,
    });
  }

  openIssue(): void {
    const dialogRef = this.dialogService.open(IssuesShowContainerComponent, {
      width: '1065px',
      data: { issueId: this.issueId },
      closable: true,
      dismissableMask: true,
    });

    dialogRef.onClose.subscribe(async (result) => {
      const docData: DocumentInterface = this.openDocumentSignal();
      if (!docData) return;

      const docParams: GetDocumentParamsInterface = pick(docData, [
        'id',
        'fileOwner',
        'forEmployee',
      ]) as GetDocumentParamsInterface;
      const section = this.getSection();

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
      this.loadDocument();
    });
  }

  onNavigateToNext(): void {
    this.navigateToNext.emit();
  }
}
