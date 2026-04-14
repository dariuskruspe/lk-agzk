import { Injectable, NgZone } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PlatformResolvedGuard implements CanActivate {
  constructor(private router: Router, private zone: NgZone) {}

  async isResolved(): Promise<boolean> {
    return new Promise((resolve) => {
      this.zone.runOutsideAngular(() => {
        const interval = setInterval(() => {
          if (this.router.config.find((v) => v.outlet === 'platform')) {
            resolve(true);
            clearInterval(interval);
          }
        }, 100);
        const timeout = setTimeout(() => {
          resolve(false);
          clearTimeout(timeout);
        }, 2000);
      });
    });
  }

  canActivate(): Promise<boolean> {
    return this.isResolved();
  }
}
