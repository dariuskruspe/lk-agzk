import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileDownloadService } from '../services/file-download.service';
// eslint-disable-next-line import/no-extraneous-dependencies

export class DownloadFileUtils {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  public constructor(
    itemSrc: any,
    name: string,
    private fileDownload?: FileDownloadService
  ) {
    this.fileDownload
      .download(itemSrc?.changingThisBreaksApplicationSecurity, name)
      .then(() => {});
  }
}

@Injectable({
  providedIn: 'root',
})
export class FileSanitizerClass {
  constructor(private sanitizer: DomSanitizer) {}

  getSafeResourceURLFromFileBase64Data(
    base64: string,
    type: string
  ): SafeResourceUrl {
    const byteArray = new Uint8Array(
      atob(base64)
        .split('')
        .map((char) => char.charCodeAt(0))
    );

    const blob = new Blob([byteArray], {
      type: `application/${
        type !== 'xlsx'
          ? type
          : 'vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }`,
    });

    return this.markAsSafeResourceURL(URL.createObjectURL(blob));
  }

  getUint8Array(base64: string): Uint8Array {
    return new Uint8Array(
      atob(base64)
        .split('')
        .map((char) => char.charCodeAt(0))
    );
  }

  /**
   * Помечаем URL ресурса как безопасный (наивно доверяем URL-у ресурса), чтобы Angular не блокировал его использование.
   *
   * !!!ACHTUNG!!! Может представлять опасность без дополнительных проверок, если "вслепую" доверять переданному URL.
   *
   * @param url URL, которому решили доверять (посчитали безопасным)
   * @returns SafeResourceUrl — якобы безопасный URL ресурса
   */
  markAsSafeResourceURL(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
