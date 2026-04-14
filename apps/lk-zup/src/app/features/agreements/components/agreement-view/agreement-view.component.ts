import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LangFacade } from '../../../../shared/features/lang/facades/lang.facade';
import { LangUtils } from '../../../../shared/features/lang/utils/lang.utils';
import { FileBase64 } from '../../../../shared/models/files.interface';
import { FileDownloadService } from '../../../../shared/services/file-download.service';
import { DocumentInterface } from '../../models/document.interface';

@Component({
    selector: 'app-agreement-employee-view',
    templateUrl: './agreement-view.component.html',
    styleUrls: ['./agreement-view.component.scss'],
    standalone: false
})
export class AgreementViewComponent implements OnChanges {
  itemSrc;

  @Input() agreementData: DocumentInterface;

  @Input() documentBase64: FileBase64;

  @Input() isShowMode = false;

  @Input() download;

  @Input() height = 600;

  constructor(
    public langUtils: LangUtils,
    public langFacade: LangFacade,
    private sanitizer: DomSanitizer,
    private fileDownload: FileDownloadService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.download?.currentValue) {
      this.downloadImg();
    }

    if (changes?.documentBase64?.currentValue) {
      const byteArray = new Uint8Array(
        atob(this.documentBase64.file64)
          .split('')
          .map((char) => char.charCodeAt(0))
      );

      const blob = new Blob([byteArray], { type: 'application/pdf' });

      this.itemSrc = this.toSanitizer(URL.createObjectURL(blob));
    }
  }

  toSanitizer(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  downloadImg(): void {
    this.fileDownload
      .download(
        this.itemSrc.changingThisBreaksApplicationSecurity,
        this.agreementData.name
      )
      .then(() => {});
  }
}
