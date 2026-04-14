import { ChangeDetectorRef, Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '@shared/services/app.service';
import { NewsletterService } from '../../services/newsletter.service';
import { NewsletterUpdateRequestInterface } from '../../models/newsletter.interface';
import { firstValueFrom } from 'rxjs';
import { MessageTemplateInterface } from '../../models/message-template.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TemplateSaveConfirmationDialogComponent } from '../../components/template-save-confirmation-dialog/template-save-confirmation-dialog.component';
import { TranslatePipe } from '@app/shared/features/lang/pipes/lang.pipe';
import { SafeResourceUrl } from '@angular/platform-browser';
import { FileSanitizerClass } from '@app/shared/utilits/download-file.utils';
import { FileDownloadService } from '@app/shared/services/file-download.service';
import { MenuItem, MessageService } from 'primeng/api';
import { FileBase64 } from '@app/shared/models/files.interface';

@Component({
  selector: 'app-newsletter-view-container',
  templateUrl: './newsletter-view-container.component.html',
  styleUrls: ['./newsletter-view-container.component.scss'],
  standalone: false,
})
export class NewsletterViewContainerComponent implements OnInit {
  app: AppService = inject(AppService);

  private readonly messageService = inject(MessageService);

  screenSize = this.app.storage.screen.data.frontend.size;
  isMobileV = this.screenSize.signal.isMobileV;

  newsletterId: string | null = null;
  newsletter: NewsletterUpdateRequestInterface | null = null;
  template: MessageTemplateInterface | null = null;

  private dialogRef: DynamicDialogRef;

  saveReportResultButtonItems: MenuItem[] = [
    {
      label: 'xlsx',
      command: () => {
        this.downloadResultReport('xlsx');
      },
    },
    {
      label: 'pdf',
      command: () => {
        this.downloadResultReport('pdf');
      },
    },
  ];

  isReportLoadingSignal: WritableSignal<boolean> = signal(false);

  notMatchedSmsResultsSignal: WritableSignal<string | null> = signal(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private newsletterService: NewsletterService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialogService: DialogService,
    private translatePipe: TranslatePipe,
    private fileSanitizer: FileSanitizerClass,
    private fileDownloader: FileDownloadService,
  ) {}

  ngOnInit(): void {
    this.newsletterId = this.route.snapshot.paramMap.get('id');
    this.getNewsletter();
  }

  onBack(): void {
    this.router.navigate(['/newsletter-management']);
  }

  async getNewsletter(): Promise<void> {
    this.newsletter = (
      await firstValueFrom(
        this.newsletterService.getNewsletter(this.newsletterId),
      )
    ).pop();
    if (this.newsletter.templateId) {
      this.template = (
        await firstValueFrom(
          this.newsletterService.getTemplate(this.newsletter.templateId),
        )
      ).pop();
    }
    this.changeDetectorRef.detectChanges();
  }

  onEdit(): void {
    this.router.navigate(['/newsletter-management/edit', this.newsletterId]);
  }

  onDelete(): void {
    this.dialogRef = this.dialogService.open(
      TemplateSaveConfirmationDialogComponent,
      {
        header: this.translatePipe.transform('NEWSLETTER_CONFIRMATION'),
        width: '450px',
        modal: true,
        closable: true,
        data: {
          message: this.newsletter.isActive
            ? this.translatePipe.transform('NEWSLETTER_ACTIVE_DELETE_CONFIRM')
            : this.translatePipe.transform('NEWSLETTER_DELETE_CONFIRM'),
          confirmButtonText: this.translatePipe.transform(
            'NEWSLETTER_YES_DELETE',
          ),
        },
      },
    );

    this.dialogRef.onClose.subscribe(async (confirmed: boolean) => {
      if (confirmed) {
        await firstValueFrom(
          this.newsletterService.deleteNewsletter(this.newsletterId),
        );
        this.router.navigate(['/newsletter-management']);
      }
      this.dialogRef = undefined;
    });
  }

  getStatusColor(statusColor: string): string {
    const statusColorList = [
      'draft',
      'onapproval',
      'inprocess',
      'done',
      'rejected',
      'canceled',
    ];
    if (statusColorList.includes(statusColor)) {
      return 'var(--' + statusColor + ')';
    } else if (!statusColor) {
      return 'var(--draft)';
    }
    return statusColor;
  }

  onCopy(): void {
    if (!this.newsletter) return;

    // Подготавливаем данные для копирования
    const copyData = {
      newsletterName: `${this.newsletter.newsletterName} (копия)`,
      description: this.newsletter.description,
      startDate: this.newsletter.startDate,
      endDate: this.newsletter.endDate,
      recipients: this.newsletter.recipients.map(
        (recipient) => recipient.userId,
      ),
      templateId: this.newsletter.templateId,
      smsTemplate: this.newsletter.smsTemplate,
    };

    // Сохраняем в localStorage
    localStorage.setItem('newsletterCopyData', JSON.stringify(copyData));

    // Перенаправляем на страницу создания
    this.router.navigate(['/newsletter-management/create']);
  }

  async onDownloadRecipients(): Promise<void> {
    if (!this.newsletter?.recipients?.length) return;
    const result = await firstValueFrom(
      this.newsletterService.getRecipientsFileForSms(
        this.newsletter.newsletterId,
      ),
    );
    const safeURL: SafeResourceUrl =
      this.fileSanitizer.getSafeResourceURLFromFileBase64Data(
        result.file,
        result.extension,
      );

    this.messageService.add({
      severity: 'success',
      summary: 'Выгрузка получателей для sms',
      detail: `Выгружено ${this.newsletter?.recipients?.length - result.notFound?.length} записей из ${this.newsletter?.recipients?.length}${result.notFound.length ? '. У ' + result.notFound.length + ' получателей не указан мобильный телефон' : ''}`,
    });
    await this.fileDownloader.download(safeURL, 'recipients_sms.txt');
  }

  async downloadReport(format: 'pdf' | 'xlsx'): Promise<void> {
    this.isReportLoadingSignal.set(true);
    let reportFile: FileBase64;
    try {
      reportFile = await firstValueFrom(
        this.newsletterService.getDownloadReport(format, this.newsletterId),
      );
    } finally {
      this.isReportLoadingSignal.set(false);
    }

    const safeURL: SafeResourceUrl =
      this.fileSanitizer.getSafeResourceURLFromFileBase64Data(
        reportFile.file64,
        reportFile.fileExtension,
      );
    await this.fileDownloader.download(safeURL, reportFile.fileName);
    return;
  }

  downloadResultReport(format: 'xlsx' | 'pdf' = 'pdf'): void {
    this.downloadReport(format).then(() => {});
  }

  async onLoadSmsResults(event: Event) {
    console.log('onLoadSmsResults');
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const file64 = await this.getBase64(file);
    await this.onChangeFile({ fileName: file.name, file64 });
    input.value = '';
  }

  private getBase64(f: Blob | File): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  async onChangeFile(file?: {
    fileName: string;
    file64: string | ArrayBuffer;
  }) {
    this.notMatchedSmsResultsSignal.set(null);
    if (!file) {
      return;
    }
    const fileRes = await firstValueFrom(
      this.newsletterService.uploadRecipientsSmsFile(file.file64, this.newsletterId),
    );
    if (fileRes?.notMatchedCount > 0) {
      this.notMatchedSmsResultsSignal.set(fileRes?.file);
    }
    this.messageService.add({
      severity: 'warn',
      summary: 'Файл загружен',
      detail: fileRes?.message || '',
    });
  }

  async onDownloadNotMatchedSmsResults(): Promise<void> {
    if (!this.notMatchedSmsResultsSignal()) return;
    const safeURL: SafeResourceUrl =
      this.fileSanitizer.getSafeResourceURLFromFileBase64Data(
        this.notMatchedSmsResultsSignal(),
        'xlsx',
      );
    await this.fileDownloader.download(safeURL, 'not_matched_sms_results.xlsx');
  }
}
