import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Optional,
  Output,
  signal,
  SimpleChanges,
  WritableSignal
} from '@angular/core';
import { EvaluationFileInterface } from '@features/career/shared/types';
import { getFileIcon } from '@wafpc/base/utils/file-icon.util';
import { FileBase64 } from '@shared/models/files.interface';
import { firstValueFrom } from 'rxjs';
import { SafeResourceUrl } from '@angular/platform-browser';
import { EvaluationApiService } from '@features/career/shared/evaluation-api.service';
import { FileDownloadService } from '@shared/services/file-download.service';
import { FileSanitizerClass } from '@shared/utilits/download-file.utils';

@Component({
    selector: 'app-evaluation-file-upload',
    imports: [
        CommonModule,
    ],
    templateUrl: './evaluation-file-upload.component.html',
    styleUrl: './evaluation-file-upload.component.scss',
    providers: [],
    standalone: true
})
export class EvaluationFileUploadComponent implements OnChanges {
  dragOver = false;

  files: WritableSignal<{fileName: string; file64: string | ArrayBuffer; icon: string, fileID: string; fileLink}[] | null> = signal(null);

  @Input() employeeFiles: EvaluationFileInterface[];

  @Input() editingAvailable: boolean = true;

  @Output() changeFiles: EventEmitter<{fileName: string; file64: string | ArrayBuffer; icon: string, fileID: string; fileLink}[]> = new EventEmitter();

  loading = signal(false);

  constructor(
    @Inject('fileIconsPath') @Optional() private readonly iconPath: string,
    private ref: ChangeDetectorRef,
    private evaluationApiService: EvaluationApiService,
    private fileDownloader: FileDownloadService,
    private fileSanitizer: FileSanitizerClass,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.employeeFiles?.currentValue?.length) {
      const filesList: {fileName: string; file64: string | ArrayBuffer; icon: string, fileID: string; fileLink}[] = [];
      changes.employeeFiles.currentValue.forEach((file: EvaluationFileInterface) => {
        const icon = getFileIcon(file.fileName, this.iconPath);
        filesList.push({fileName: file.fileName, file64: '', icon, fileID: file.fileID, fileLink: file.fileLink});
      });
      this.files.set(filesList);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i += 1) {
        this.handleFile(input.files[i]);
      }
      // this.changeFilesList();
    }
  }

  handleFile(file: File) {
    this.getBase64(file).then((file64) => {
      const fileName = file.name;
      const icon = getFileIcon(fileName, this.iconPath);
      const fileObj = { fileName, file64, icon, fileID: '', fileLink: '' };
      const filesList = this.files() || [];
      filesList.push(fileObj);
      this.files.set(filesList);
      this.changeFiles.emit(this.files());
    });
  }

  getBase64(f: Blob | File): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  changeFilesList() {
    this.ref.detectChanges();
  }

  removeFile(i: number) {
    const newFiles = this.files();
    newFiles.splice(i, 1);
    this.files.set(newFiles);
    this.ref.detectChanges();
    this.changeFiles.emit(this.files());
  }

  async downloadFile(fileLink: string): Promise<void> {
    if (!fileLink) return;
    this.loading.set(true);
    let downloadingFile: FileBase64;
    try {
      downloadingFile = await firstValueFrom(
        this.evaluationApiService.getDownloadFile(fileLink),
      );
    } finally {
      this.loading.set(false);
    }

    const safeURL: SafeResourceUrl =
      this.fileSanitizer.getSafeResourceURLFromFileBase64Data(
        downloadingFile.file64,
        downloadingFile.fileExtension,
      );
    await this.fileDownloader.download(safeURL, downloadingFile.fileName);
    return;
  }
}
