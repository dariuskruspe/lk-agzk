import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-pushes-allow-hint-dialog',
    templateUrl: './pushes-allow-hint-dialog.component.html',
    styleUrls: ['./pushes-allow-hint-dialog.component.scss'],
    standalone: false
})
export class PushesAllowHintDialogComponent {
  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {}

  onClose() {
    this.ref.close('ok');
  }
}
