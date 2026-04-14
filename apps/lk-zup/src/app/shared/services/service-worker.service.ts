import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MainCurrentUserFacade } from '../../features/main/facades/main-current-user.facade';

@Injectable({
  providedIn: 'root',
})
export class ServiceWorkerService {
  readonly reg: Promise<ServiceWorkerRegistration | null>;

  constructor(
    private http: HttpClient,
    private currentUserFacade: MainCurrentUserFacade
  ) {
    /* if (typeof navigator?.serviceWorker?.register !== 'function') {
      // eslint-disable-next-line no-console
      console.log(new Error('Service workers are not supported'));
      this.reg = Promise.resolve(null);
    } else {
      this.reg = navigator.serviceWorker.register('sw.js');
    }*/
  }
}
