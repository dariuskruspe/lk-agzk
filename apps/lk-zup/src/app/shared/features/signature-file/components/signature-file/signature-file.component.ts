import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { DocumentInterface } from '@features/agreements/models/document.interface';
import { ProvidersInterface } from '@shared/features/signature-validation-form/models/providers.interface';
import { UserStorageInterface } from '@shared/interfaces/storage/user/user-storage.interface';
import { AppService } from '@shared/services/app.service';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-signature-file',
  templateUrl: './signature-file.component.html',
  styleUrls: ['./signature-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
  standalone: false,
})
export class SignatureFileComponent implements OnInit {
  app: AppService = inject(AppService);

  currentUserStorage: UserStorageInterface = this.app.storage.user.current;

  openDocumentSignal: WritableSignal<DocumentInterface> =
    this.currentUserStorage.data.frontend.signal.openDocument;

  isDocumentLoadingSignal: WritableSignal<boolean> =
    this.currentUserStorage.data.frontend.signal.isDocumentLoading;

  openDocumentFileUint8ArraySignal: WritableSignal<Uint8Array> =
    this.currentUserStorage.data.frontend.signal.openDocumentFileUint8Array;

  openDocumentFileUint8Array$ = toObservable(
    this.openDocumentFileUint8ArraySignal,
  );

  private confirmationService = inject(ConfirmationService);

  @Input() hasAgreement = false;

  @Input() dialogRef: unknown;

  @Input() providers: ProvidersInterface;

  @Input() isSignatureRequired = true;

  @Input() isSignatureEnabled = true;

  @Input() buttonCaption = 'BUTTON_SIGN';

  @Input() refuseEnabled = true;

  @Input() issueId: string;

  @Input() document: DocumentInterface | null = null;
  @Input() documentFileUint8Array: Uint8Array | null = null;
  @Input() isDocumentFileLoading: boolean | null = null;
  @Input() fileTimestamp: number | null = null;

  @Output() onclose = new EventEmitter<unknown>();

  @Output() ondownload = new EventEmitter<{
    type: string;
  }>();

  @Output() onsign = new EventEmitter<unknown>();

  @Output() onrefuse = new EventEmitter<unknown>();

  @Output() onreworkPresentation = new EventEmitter<unknown>();

  @Output() setDocViewed = new EventEmitter();

  @Output() onissue = new EventEmitter();
  @Output() navigateToNext = new EventEmitter<void>();
  @Input() showNextButton = false;
  @Input() hasNextDocument = false;
  @Input() isSigning = false;
  @Input() isLoadingNext = false;

  @ViewChild('downloadButton') downloadButton: ElementRef;

  public checked = false;

  public openedDownloadMethod = false;

  public readonly downloadOptions: {
    title: string;
    icon: string;
    id: string;
  }[] = [
    {
      title: 'BUTTON_FILE',
      icon: 'pi pi-file-pdf',
      id: 'file',
    },
    {
      title: 'BUTTON_ARCHIVE',
      icon: 'pi pi-inbox',
      id: 'arch',
    },
    {
      title: 'BUTTON_HISTORY',
      icon: 'pi pi-history',
      id: 'documentLogs',
    },
  ];

  constructor(private dialogService: DialogService) {}

  @HostListener('document:click', ['$event.target'])
  clickOutside(targetElement: HTMLElement): void {
    if (!this.downloadButton.nativeElement.contains(targetElement)) {
      this.openedDownloadMethod = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.file && changes.file.currentValue) {
      this.setDocViewed.emit();
    }
  }

  ngOnInit(): void {
    this.addSubscriptions();
  }

  addSubscriptions(): void {
    this.addDocFileSubscription();
  }

  addDocFileSubscription(): void {
    // Если файл передан через @Input, эмитим сразу
    if (this.documentFileUint8Array) {
      this.setDocViewed.emit();
      return;
    }

    // Иначе подписываемся на глобальный сигнал
    this.openDocumentFileUint8Array$
      .pipe(
        filter((v) => !!v),
        take(1),
      )
      .subscribe({
        next: (docFileAsUint8Array: Uint8Array): void => {
          this.setDocViewed.emit();
        },
      });
  }

  get currentDocument(): DocumentInterface | null {
    return this.document ?? this.openDocumentSignal();
  }

  get currentDocumentFileUint8Array(): Uint8Array | null {
    // ВАЖНО: Если documentFileUint8Array передан через @Input, ВСЕГДА используем его
    // Это критично для модального режима, чтобы не использовать глобальный сигнал
    // Проверяем не только на null/undefined, но и на наличие значения (даже если это пустой массив)
    const hasInputValue =
      this.documentFileUint8Array !== null &&
      this.documentFileUint8Array !== undefined;

    if (hasInputValue) {
      return this.documentFileUint8Array;
    }
    // Только если @Input не передан, используем глобальный сигнал
    return this.openDocumentFileUint8ArraySignal();
  }

  get currentIsDocumentFileLoading(): boolean {
    if (
      this.isDocumentFileLoading !== null &&
      this.isDocumentFileLoading !== undefined
    ) {
      return this.isDocumentFileLoading;
    }
    return this.isDocumentLoadingSignal();
  }

  openDownloadOptions(): void {
    const docFileAsUint8Array: Uint8Array = this.currentDocumentFileUint8Array;
    if (docFileAsUint8Array) {
      this.openedDownloadMethod = !this.openedDownloadMethod;
    }
  }

  openIssue(): void {
    this.onissue.emit();
  }

  onClickDownload(e: {
    option: { id: 'file' | 'arch' | 'documentLogs' };
  }): void {
    this.ondownload.emit({ type: e.option.id });
  }

  sign(): void {
    this.onsign.emit();
  }

  get isChecked(): boolean {
    return (this.hasAgreement && this.checked) || !this.hasAgreement;
  }

  refuseSign(): void {
    this.onrefuse.emit();
  }

  rework(): void {
    this.confirmationService.confirm({
      message:
        'Вы действительно хотите инициировать возврат на доработку. Текущий документ будет отклонен ?',
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Да',
      rejectLabel: 'Нет',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.onreworkPresentation.emit();
      },
      reject: (type) => {},
    });
  }

  onNavigateToNext(): void {
    this.navigateToNext.emit();
  }
}
