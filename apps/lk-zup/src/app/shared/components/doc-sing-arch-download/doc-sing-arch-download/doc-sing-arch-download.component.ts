import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { FileBase64 } from '../../../models/files.interface';
import { FileDownloadService } from '../../../services/file-download.service';
import { FileSanitizerClass } from '../../../utilits/download-file.utils';

@Component({
    selector: 'app-doc-sing-arch-download',
    templateUrl: './doc-sing-arch-download.component.html',
    styleUrls: ['./doc-sing-arch-download.component.scss'],
    standalone: false
})
export class DocSingArchDownloadComponent implements OnChanges {
  constructor(
    private fileSanitizerClass: FileSanitizerClass,
    private fileDownload: FileDownloadService
  ) {}

  @Input() issueArch: FileBase64;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.issueArch?.currentValue) {
      this.onDownloadFile(
        this.fileSanitizerClass.getSafeResourceURLFromFileBase64Data(
          this.issueArch.file64,
          this.issueArch.fileExtension
        ),
        this.issueArch.fileName
      );
    }
  }

  onDownloadFile(itemSrc: SafeResourceUrl, fileName: string): void {
    this.fileDownload.download(itemSrc, fileName).then(() => {});
  }
}
