import { Injectable, Injector } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { ProvidersInterface } from '../models/providers.interface';
import { injectResource } from '@app/shared/services/api-resource/utils';
import { SignProvidersResource } from '@app/shared/api-resources/sign-providers.resource';

@Injectable({
  providedIn: 'root',
})
export class ProvidersState {
  public entityName = 'providers';
  signProvidersResource = injectResource(SignProvidersResource);

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getProviders,
    },
  };

  getProviders(): Observable<ProvidersInterface> {
    return this.signProvidersResource.asObservable();
  }
}
