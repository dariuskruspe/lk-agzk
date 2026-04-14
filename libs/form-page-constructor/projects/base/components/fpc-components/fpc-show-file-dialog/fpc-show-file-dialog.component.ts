import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  FpcInputsInterface,
  FpcOptionInterface,
} from '../../../models/fpc.interface';

@Component({
    template: '',
    standalone: false
})
export class FpcBaseShowFileDialogComponent {
  imageSrc;

  public data: {
    fileBase64: {
      fileName: string;
      fileExtension: string;
      file64: string;
      fileType?: string;
    };
  };

  @Input() item: FpcInputsInterface;

  @Input() options: FpcOptionInterface;

  constructor(
    protected sanitizer: DomSanitizer
  ) {}

  toSanitizer(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  downloadImg(): void {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = this.imageSrc.changingThisBreaksApplicationSecurity;
    a.download = `${
      this.data.fileBase64.fileName
    }_${new Date().toLocaleDateString()}.${this.data.fileBase64.fileExtension}`;
    a.click();
    a.remove();
  }
}
