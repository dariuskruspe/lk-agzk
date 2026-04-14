import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ReportDialogV2DialogConfig } from '../shared/types';
import { ReportApiService } from '@app/shared/services/api/report-api.service';
import { autoaborted } from '@app/shared/utilits/autoaborted';
import { toSignal } from '@angular/core/rxjs-interop';
import { FileBase64 } from '@app/shared/models/files.interface';
import { ToolbarModule } from 'primeng/toolbar';
import { LangModule } from '../../lang/lang.module';
import { TranslatePipe } from '../../lang/pipes/lang.pipe';
import { SplitButtonModule } from 'primeng/splitbutton';
import { PdfViewerModule } from '@app/shared/components/pdf-viewer/pdf-viewer.module';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FileDownloadService } from '@app/shared/services/file-download.service';
import { from, mergeMap } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppSelectButtonComponent } from '@app/shared/components/app-select-button/app-select-button.component';
import { AppSelectButtonOptionComponent } from '@app/shared/components/app-select-button/app-select-button-option/app-select-button-option.component';
import { GetReportParamsInterface } from '@app/shared/services/api/report-api.service';

@Component({
  selector: 'app-report-dialog-v2',
  imports: [
    ToolbarModule,
    LangModule,
    SplitButtonModule,
    PdfViewerModule,
    ProgressSpinnerModule,
    AppSelectButtonComponent,
    AppSelectButtonOptionComponent,
  ],
  templateUrl: './report-dialog-v2.html',
  styleUrl: './report-dialog-v2.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportDialogV2 {
  config = inject(DynamicDialogConfig);
  data = this.config.data as ReportDialogV2DialogConfig;

  private reportApi = inject(ReportApiService);
  private translatePipe = inject(TranslatePipe);
  private sanitizer = inject(DomSanitizer);
  private fileDownload = inject(FileDownloadService);

  loadFileRequest = autoaborted();

  downloadFileRequest = autoaborted();

  isLoading = toSignal(this.loadFileRequest.loading$);

  isDownloading = toSignal(this.downloadFileRequest.loading$);

  pdfFile = signal<FileBase64 | null>(null);

  pdfFileError = signal<Error | null>(null);

  formats = this.data.report.formats ?? ['pdf'];

  saveReportButtonItems = computed(() =>
    this.formats.map((format) => ({
      label: format,
      command: () => this.downloadFile(format),
    })),
  );

  constructor() {
    effect(() => {
      const file = this.pdfFile();
      if (file) {
        this.config.header = file.fileName;
      }
    });

    effect(() => {
      const saveReportButtonItems = this.saveReportButtonItems();
      if (saveReportButtonItems.length > 1) {
        this.config.dismissableMask = false;
      }
    });
  }

  fetchPdfFile() {
    this.loadFileRequest({
      obs: this.reportApi.getReport({
        ...this.getReportParams(),
        format: 'pdf',
      }),
      next: (file: FileBase64) => {
        this.pdfFile.set(file);
      },
      error: (error: Error) => {
        this.pdfFileError.set(error);
      },
    });
  }

  ngOnInit() {
    this.fetchPdfFile();
  }

  downloadFile(format?: string) {
    // если мы уже загрузили файл, то не повторяем запрос
    if (!format || format === this.pdfFile()?.fileType) {
      this.saveFile(this.pdfFile());
      return;
    }

    this.downloadFileRequest({
      obs: this.reportApi.getReport({
        ...this.getReportParams(),
        format: format ?? 'pdf',
      }),
      next: (file: FileBase64) => {
        this.saveFile(file);
      },
    });
  }

  private getReportParams() {
    const params: GetReportParamsInterface = {
      dateBegin: new Date(this.data.report.dateBegin),
      reportId: this.data.report.reportId,
    };

    if (this.data.report.dateEnd) {
      params.dateEnd = new Date(this.data.report.dateEnd);
    }

    return params;
  }

  private async saveFile(file: FileBase64) {
    const byteArray = new Uint8Array(
      atob(file.file64)
        .split('')
        .map((char) => char.charCodeAt(0)),
    );
    const blob = new Blob([byteArray], { type: file.fileType });
    const safeURL = this.toSanitizer(URL.createObjectURL(blob));

    await this.fileDownload.download(
      safeURL,
      `${file.fileName}_${new Date().toLocaleDateString()}.${file.fileExtension}`,
    );
  }

  toSanitizer(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
