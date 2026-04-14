import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlatformModuleResolver implements Resolve<void> {
  private resolved = false;

  private readonly isDesktop = (window as any).isDesktop;

  constructor(private router: Router) {}

  resolve(): Observable<void> {
    return new Observable((subscriber) => {
      if (this.resolved) {
        subscriber.next();
        subscriber.complete();
        return;
      }
      let module;
      if (this.isDesktop) {
        module = import('./desktop/desktop.module').then(
          (m) => m.DesktopModule
        );
      } else {
        module = import('./mobile/mobile.module').then((m) => m.MobileModule);
      }
      module.then(() => {
        const config = [
          {
            path: '',
            outlet: 'platform',
            loadChildren: () => module,
          },
          ...this.router.config,
        ];
        // const pathFragments = window.location.pathname
        //   .split('/')
        //   .filter((v) => !!v);
        // const paramsStringified = window.location.search.split('?')?.[1];
        // let params = {};
        // if (paramsStringified) {
        //   params = paramsStringified.split('&').reduce((acc, value) => {
        //     const parsedValue = value.split('=');
        //     acc[parsedValue[0]] = parsedValue[1];
        //     return acc;
        //   }, {});
        // }
        this.router.resetConfig(config);
        this.resolved = true;
        subscriber.next();
        subscriber.complete();
      });
    });
  }
}
