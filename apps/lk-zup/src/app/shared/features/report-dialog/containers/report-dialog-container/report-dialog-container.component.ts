import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { firstValueFrom, Subject } from 'rxjs';
import { ReportInterface } from '../../models/report.interface';
import { MenuItem } from 'primeng/api';
import { FileBase64 } from '@shared/models/files.interface';
import { SafeResourceUrl } from '@angular/platform-browser';
import {
  GetReportParamsInterface,
  ReportApiService,
} from '@shared/services/api/report-api.service';
import { FileSanitizerClass } from '@shared/utilits/download-file.utils';
import { FileDownloadService } from '@shared/services/file-download.service';

@Component({
  selector: 'app-report-dialog-container',
  templateUrl: './report-dialog-container.component.html',
  styleUrls: ['./report-dialog-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ReportDialogContainerComponent implements OnInit {
  eventDownload = new Subject<string>();

  public facade: ReportInterface;

  private params: Record<string, unknown>;

  formats: string[];

  saveReportButtonItems: MenuItem[] = [];

  isReportLoadingSignal: WritableSignal<boolean> = signal(false);

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private reportApi: ReportApiService,
    private fileSanitizer: FileSanitizerClass,
    private fileDownloader: FileDownloadService,
  ) {}

  ngOnInit(): void {
    this.facade = this.config.data.facade;
    this.params = this.config.data.params;
    this.formats = this.config.data.params.formats;
    if (this.formats && this.formats.length) {
      this.config.dismissableMask = false;
      this.formats.forEach((format) => {
        this.saveReportButtonItems.push({
          label: format,
          command: () => {
            this.downloadImg(format);
          },
        });
      });
    }
    if (this.facade) {
      this.facade.getFile(this.params);
      this.facade.onInit((v: { fileName: string }) => {
        this.config.header = v.fileName ?? '';
      });
    }
  }

  async downloadImg(format?: string): Promise<void> {
    if (format && format !== 'pdf') {
      await this.downloadByFormat(format);
    } else if (
      this.formats &&
      this.formats.length === 1 &&
      this.formats[0] !== 'pdf'
    ) {
      await this.downloadByFormat(this.formats[0]);
    } else {
      this.eventDownload.next(format);
    }
  }

  async downloadByFormat(format: string) {
    this.config.closable = false;
    let reportFile: FileBase64;

    this.isReportLoadingSignal.set(true);
    try {
      const params: GetReportParamsInterface = {
        dateBegin: this.params.dateBegin
          ? new Date(this.params.dateBegin.toString())
          : undefined,
        dateEnd: this.params.dateEnd
          ? new Date(this.params.dateEnd.toString())
          : undefined,
        reportId: this.params.reportId.toString(),
        format: format,
      };
      reportFile = await firstValueFrom(this.reportApi.getReport(params));
    } finally {
      const safeURL: SafeResourceUrl =
        this.fileSanitizer.getSafeResourceURLFromFileBase64Data(
          reportFile.file64,
          reportFile.fileExtension,
        );
      this.config.closable = true;
      this.isReportLoadingSignal.set(false);
      await this.fileDownloader.download(
        safeURL,
        reportFile.fileName + '.' + reportFile.fileExtension,
      );
    }
  }
}
