import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-issues-copy-attachment-dialog',
    templateUrl: './issues-copy-attachment-dialog.component.html',
    styleUrls: ['./issues-copy-attachment-dialog.component.scss'],
    standalone: false
})
export class IssuesCopyAttachmentDialogComponent {
  text: string;

  constructor(
    private ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) {
    this.text = this.config.data;
  }

  close(value: boolean): void {
    this.ref.close(value);
  }
}
