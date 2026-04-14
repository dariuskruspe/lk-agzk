import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthSsoSaml2Facade } from '../../facades/auth-sso-saml2.facade';

@Component({
    selector: 'app-auth-sso-saml2-res-container',
    templateUrl: './auth-sso-saml2-res-container.component.html',
    styleUrls: ['./auth-sso-saml2-res-container.component.scss'],
    standalone: false
})
export class AuthSsoSaml2ResContainerComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    public authSsoSaml2Facade: AuthSsoSaml2Facade
  ) {}

  ngOnInit(): void {
    this.authSsoSaml2Facade.authAttempt(
      this.activatedRoute.snapshot.queryParams
    );
  }
}
