import { Injectable } from '@angular/core';
import { CanActivate, RedirectCommand, Router } from '@angular/router';
import { LocalStorageService } from '@shared/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthLoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private localstorageService: LocalStorageService,
  ) {}

  isAuth(): boolean | Promise<boolean> | RedirectCommand {
    const accessToken = this.localstorageService.getTokens();
    if (accessToken) {
      return new RedirectCommand(this.router.parseUrl(''));
    }
    return true;
  }

  canActivate(): boolean | Promise<boolean> | RedirectCommand {
    return this.isAuth();
  }
}
