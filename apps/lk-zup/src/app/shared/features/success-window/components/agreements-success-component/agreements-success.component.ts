import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-agreements-success-component',
    templateUrl: './agreements-success.component.html',
    styleUrls: ['./agreements-success.scss'],
    standalone: false
})
export class AgreementsSuccessComponent {
  constructor(public dialogRef: DynamicDialogRef) {}

  onCloseDialog(): void {
    this.dialogRef.close();
  }
}
