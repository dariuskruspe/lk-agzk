import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-pushes-enable-dialog',
    templateUrl: './pushes-enable-dialog.component.html',
    styleUrls: ['./pushes-enable-dialog.component.scss'],
    standalone: false
})
export class PushesEnableDialogComponent {
  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {}

  onAccept() {
    this.ref.close('ok');
  }

  onNeverShow() {
    this.ref.close('never-show');
  }

  onDecline() {
    this.ref.close('decline');
  }
}
