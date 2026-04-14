import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FilterModule } from '@shared/features/fpc-filter/filter.module';
import { LangModule } from '@shared/features/lang/lang.module';
import { AppService } from '@shared/services/app.service';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { GoalsApiService } from '@features/career/shared/goals-api.service';
import { FileBase64 } from '@shared/models/files.interface';
import { firstValueFrom } from 'rxjs';
import { SafeResourceUrl } from '@angular/platform-browser';
import { FileDownloadService } from '@shared/services/file-download.service';
import { FileSanitizerClass } from '@shared/utilits/download-file.utils';
import { MenuItem } from 'primeng/api';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { UserSettingsInterface } from '@shared/models/menu-condition.interface';

@Component({
    selector: 'app-career',
    imports: [
        CommonModule,
        LangModule,
        ToolbarModule,
        RouterLink,
        FilterModule,
        InputTextModule,
        ReactiveFormsModule,
        RouterOutlet,
        RouterLinkActive,
        SplitButtonModule,
    ],
    templateUrl: './career.component.html',
    styleUrl: './career.component.scss'
})
export class CareerComponent {
  private app = inject(AppService);

  goalsApi = inject(GoalsApiService);

  theme = this.app.theme;

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

  settingsSignal: WritableSignal<SettingsInterface> =
    this.app.storage.settings.data.frontend.signal.globalSettings;

  userSettingsSignal: WritableSignal<UserSettingsInterface> =
    this.app.userSettingsSignal;

  constructor(
    private fileDownloader: FileDownloadService,
    private fileSanitizer: FileSanitizerClass,
  ) {}

  async downloadReport(format: 'pdf' | 'xlsx'): Promise<void> {
    this.isReportLoadingSignal.set(true);
    let reportFile
      :
      FileBase64;
    try {
      reportFile = await firstValueFrom(
        this.goalsApi.getDownloadReport(format),
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
}
