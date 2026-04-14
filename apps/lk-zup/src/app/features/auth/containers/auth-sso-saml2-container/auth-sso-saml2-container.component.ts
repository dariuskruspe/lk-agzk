import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SettingsFacade } from '@shared/features/settings/facades/settings.facade';
import { AuthSsoSaml2Facade } from '../../facades/auth-sso-saml2.facade';

@Component({
    selector: 'app-auth-sso-container',
    templateUrl: './auth-sso-saml2-container.component.html',
    styleUrls: ['./auth-sso-saml2-container.component.scss'],
    standalone: false
})
export class AuthSsoSaml2ContainerComponent implements OnInit {
  isLoading = true;

  constructor(
    public authSsoSaml2Facade: AuthSsoSaml2Facade,
    private activatedRoute: ActivatedRoute,
    public settingsFacade: SettingsFacade
  ) {}

  ngOnInit() {
    const hasError =
      this.activatedRoute.snapshot.queryParams.hasError === 'true';
    if (!hasError && this.settingsFacade.getData().general.skipLoginButton) {
      this.authSooRequest();
    } else {
      this.isLoading = false;
    }
  }

  authSooRequest(): void {
    this.authSsoSaml2Facade.authnRequest(
      this.activatedRoute.snapshot.queryParams.issuerUrl ||
        document.location.href
    );
  }
}
