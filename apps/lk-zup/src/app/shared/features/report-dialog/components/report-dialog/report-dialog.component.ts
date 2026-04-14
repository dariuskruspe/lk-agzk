import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileBase64 } from '../../../../models/files.interface';
import { FileDownloadService } from '../../../../services/file-download.service';

@Component({
    selector: 'app-report-dialog',
    templateUrl: './report-dialog.component.html',
    styleUrls: ['./report-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ReportDialogComponent implements OnChanges {
  imageSrc: string | SafeResourceUrl;

  @Input() data: FileBase64;

  @Input() set download(format: string) {
    if (this.imageSrc) {
      this.fileDownload.download(
        this.imageSrc,
        `${this.data.fileName}_${new Date().toLocaleDateString()}.${
          format || this.data.fileExtension
        }`,
      );
    }
  }

  constructor(
    private sanitizer: DomSanitizer,
    private fileDownload: FileDownloadService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && changes.data.currentValue) {
      const byteArray = new Uint8Array(
        atob(this.data.file64)
          .split('')
          .map((char) => char.charCodeAt(0))
      );
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      this.imageSrc = this.toSanitizer(URL.createObjectURL(blob));
    }
  }

  toSanitizer(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
