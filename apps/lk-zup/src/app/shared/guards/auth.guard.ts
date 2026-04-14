import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RedirectCommand,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AppService } from '@shared/services/app.service';
import { Environment } from '../classes/ennvironment/environment';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private previousBlockedUrl: string;

  private previousBlockedParams: any;

  constructor(
    private router: Router,
    private localstorageService: LocalStorageService,
    private app: AppService,
  ) {}

  isAuth(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean | Promise<boolean> | RedirectCommand {
    const accessToken = this.localstorageService.getTokens();
    if (accessToken) {
      if (this.previousBlockedUrl) {
        this.router.navigate([this.previousBlockedUrl], {
          queryParams: this.previousBlockedParams,
        });
        this.previousBlockedUrl = null;
        return false;
      }

      return true;
    }

    const index = state.url?.indexOf('?');
    if (
      !state.url.includes('newPass') &&
      !state.url.includes('issueEmailApprove')
    ) {
      this.previousBlockedUrl =
        index === -1 ? state.url : state.url.substring(0, index);
      this.localstorageService.setPreviousBlockedUrl(this.previousBlockedUrl);
      this.localstorageService.setPreviousBlockedUrlParams(
        state.root.queryParams,
      );
      this.previousBlockedParams = state.root.queryParams;
    }
    const options: { queryParams?: unknown } = {};
    if (Environment.inv().authType === 'sso') {
      // options.queryParams = { issuerUrl: document.location.href };
    }

    return this.app.redirectToLoginPageCommand();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean | Promise<boolean> | RedirectCommand {
    return this.isAuth(route, state);
  }
}
