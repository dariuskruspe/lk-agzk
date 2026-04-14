import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AbstractValidationComponent } from '../abstract-validation/abstract-validation.component';

@Component({
    selector: 'app-creation-signature',
    templateUrl: './creation-signature.component.html',
    styleUrls: ['./creation-signature.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CreationSignatureComponent extends AbstractValidationComponent {
  constructor(
    protected config: DynamicDialogConfig,
    protected dialogRef: DynamicDialogRef,
    private router: Router
  ) {
    super(config, dialogRef);
  }

  goToSignatures(): void {
    this.router.navigate(['users', 'profile', 'signature']);
    this.close();
  }
}
