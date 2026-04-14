import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AbstractValidationComponent } from '../abstract-validation/abstract-validation.component';

@Component({
    selector: 'app-confirm-validation',
    templateUrl: './confirm-validation.component.html',
    styleUrls: ['./confirm-validation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ConfirmValidationComponent extends AbstractValidationComponent {
  constructor(
    protected config: DynamicDialogConfig,
    protected dialogRef: DynamicDialogRef
  ) {
    super(config, dialogRef);
  }
}
