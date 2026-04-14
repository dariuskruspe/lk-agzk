import { Component, Inject, OnInit, Optional } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  FpcBaseShowFileDialogComponent
} from '../../../base/components/fpc-components/fpc-show-file-dialog/fpc-show-file-dialog.component';
import { getFileIcon } from '../../../base/utils/file-icon.util';

@Component({
    selector: 'fpc-show-file-dialog',
    templateUrl: './fpc-show-file-dialog.component.html',
    styleUrls: ['./fpc-show-file-dialog.component.scss'],
    standalone: false
})
export class FpcShowFileDialogComponent extends FpcBaseShowFileDialogComponent implements OnInit {
  icon: string;

  constructor(
    public config: DynamicDialogConfig,
    public dialogRef: DynamicDialogRef,
    protected sanitizer: DomSanitizer,
    @Inject('fileIconsPath') @Optional() private readonly iconPath: string,
  ) {
    super(sanitizer)
  }

  ngOnInit(): void {
    this.data = this.config.data;
    this.icon = getFileIcon(this.data.fileBase64.fileName, this.iconPath);
    const byteArray = new Uint8Array(
      atob(this.data.fileBase64.file64)
        .split('')
        .map((char) => char.charCodeAt(0))
    );
    const blob = new Blob([byteArray], {
      type: `application/${this.data.fileBase64.fileExtension}`,
    });
    this.imageSrc = this.toSanitizer(URL.createObjectURL(blob));
  }

  onCloseDialog(): void {
    this.dialogRef.close();
  }
}
