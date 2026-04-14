import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot,
} from '@angular/router';
import { MainMenuVisibilityService } from '../../features/main/services/main-menu-visibility.service';

@Injectable({
  providedIn: 'root',
})
export class VisibilityGuard implements CanActivate, CanActivateChild {
  constructor(private mainMenuVisibilityService: MainMenuVisibilityService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    return this.mainMenuVisibilityService.hasItemByUrl(state.url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    return this.mainMenuVisibilityService.hasItemByUrl(state.url);
  }
}
