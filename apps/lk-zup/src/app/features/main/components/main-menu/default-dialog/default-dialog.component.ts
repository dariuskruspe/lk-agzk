import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-dialog-elements-example-dialog',
    templateUrl: 'default-dialog.component.html',
    styles: [
        `
      p {
        margin-bottom: 20px;
      }
    `,
    ],
    standalone: false
})
export class DefaultDialogComponent {
  constructor(public dialogRef: DynamicDialogRef) {}
}
