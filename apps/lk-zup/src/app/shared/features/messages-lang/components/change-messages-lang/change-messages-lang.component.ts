import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-change-messages-lang',
    templateUrl: './change-messages-lang.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ChangeMessagesLangComponent {
  constructor(private dialogRef: DynamicDialogRef) {}

  close(isSave: boolean): void {
    this.dialogRef.close(isSave);
  }
}
