import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-surveys-management-edit-form',
    templateUrl: './surveys-management-edit-form.component.html',
    styleUrls: ['./surveys-management-edit-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SurveysManagementEditFormComponent {
  constructor(public dialogRef: DynamicDialogRef) {}

  onCansel() {
    this.dialogRef.close();
  }
}
