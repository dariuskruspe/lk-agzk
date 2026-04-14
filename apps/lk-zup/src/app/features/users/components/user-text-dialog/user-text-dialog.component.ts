import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-user-text-dialog',
    templateUrl: './user-text-dialog.component.html',
    styleUrls: ['./user-text-dialog.component.scss'],
    standalone: false
})
export class UserTextDialogComponent {
  constructor(public dialogRef: DynamicDialogRef) {}

  close() {
    this.dialogRef.close();
  }
}
