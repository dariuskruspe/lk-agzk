import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthFactor2CodeFacade } from '../../facades/auth-factor2-code.facade';

@Component({
    selector: 'app-auth-factor2-code-container',
    templateUrl: './auth-factor2-code-container.component.html',
    styleUrls: ['./auth-factor2-code-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AuthFactor2CodeContainerComponent {
  constructor(public authFactor2CodeFacade: AuthFactor2CodeFacade) {}

  onSubmitForm(data: { code: string }): void {
    this.authFactor2CodeFacade.codeValidate(data);
  }
}
