import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'agreements-employee-preview-file-dialog',
    templateUrl: './agreements-employee-preview-file-dialog.component.html',
    styleUrls: ['./agreements-employee-preview-file-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AgreementsEmployeePreviewFileDialogComponent {
  value: string;

  constructor(public config: DynamicDialogConfig) {
    this.value = this.config.data.file64;
  }
}
