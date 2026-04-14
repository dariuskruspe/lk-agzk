import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-auth-sso',
    templateUrl: './auth-sso-saml2.component.html',
    styleUrls: ['./auth-sso-saml2.component.scss'],
    standalone: false
})
export class AuthSsoSaml2Component {
  form: FormGroup;

  @Input() authnRequestData;

  @Input() isLoading: boolean;

  @Output() authSooRequest = new EventEmitter();

  onAuthSooRequest(): void {
    this.authSooRequest.emit();
  }
}
