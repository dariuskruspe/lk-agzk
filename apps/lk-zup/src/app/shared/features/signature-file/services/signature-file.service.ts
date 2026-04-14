import { Injectable, Optional } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SignatureFileContainerComponent } from '../containers/signature-file-container/signature-file-container.component';

@Injectable()
export class SignatureFileService {
  constructor(@Optional() private dialog: DialogService) {}

  openInDialog(data: unknown): DynamicDialogRef {
    if (!this.dialog) {
      throw new Error(
        "Please provide primeng DialogService into your component initiating file's signature"
      );
    }

    return this.dialog.open(SignatureFileContainerComponent, {
      closable: true,
      dismissableMask: true,
      data,
    });
  }
}
