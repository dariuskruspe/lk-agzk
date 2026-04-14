import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ActionAlertInterface } from '../../../../../features/main/models/alerts.interface';

@Component({
    template: '',
    standalone: false
})
export class AbstractActionComponent {
  readonly data: ActionAlertInterface;

  constructor(protected config: DynamicDialogConfig) {
    this.data = this.config.data;
  }
}

@Component({
    template: '',
    standalone: false
})
export class AbstractConfirmationActionComponent extends AbstractActionComponent {
  constructor(
    protected config: DynamicDialogConfig,
    protected dialogRef: DynamicDialogRef
  ) {
    super(config);
  }

  confirmAction(data: { cancel: boolean; code?: string }): void {
    const result: any = {
      objectID: this.data.objects[0],
      action: this.data.type,
      cancelled: !!data.cancel,
    };
    if (!data.cancel) {
      result.code = data.code;
    }
    this.dialogRef.close(result);
  }

  cancelAction(): void {
    this.confirmAction({ cancel: true });
  }
}
