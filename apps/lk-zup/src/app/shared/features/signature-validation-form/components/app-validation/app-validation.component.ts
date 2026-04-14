import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AbstractValidationComponent } from '../abstract-validation/abstract-validation.component';

@Component({
    selector: 'app-other-app-validation',
    templateUrl: './app-validation.component.html',
    styleUrls: ['./app-validation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AppValidationComponent extends AbstractValidationComponent {
  constructor(
    protected config: DynamicDialogConfig,
    protected dialogRef: DynamicDialogRef
  ) {
    super(config, dialogRef);
  }
}
