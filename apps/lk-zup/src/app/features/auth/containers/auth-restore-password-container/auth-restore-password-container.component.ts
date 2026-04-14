import { Component } from '@angular/core';
import { AuthRestorePasswordFacade } from '../../facades/auth-restore-password.facade';
import { AuthRestorePasswordInterface } from '../../models/auth-restore-password.interface';

@Component({
    selector: 'app-auth-restore-password-container',
    templateUrl: './auth-restore-password-container.component.html',
    styleUrls: ['./auth-restore-password-container.component.scss'],
    standalone: false
})
export class AuthRestorePasswordContainerComponent {
  constructor(public restorePasswordFacade: AuthRestorePasswordFacade) {}

  submitPasswordForm(data: AuthRestorePasswordInterface): void {
    this.restorePasswordFacade.restore(data);
  }
}
