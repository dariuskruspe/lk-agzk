import { Injectable } from '@angular/core';
import { AbstractFacade } from '@shared/classes/abstractions/abstract.facade';
import { GeRx } from 'gerx';
import { AuthLoginInterface } from '../models/auth-login.interface';
import { AuthLoginState } from '../states/auth-login.state';

@Injectable({
  providedIn: 'root',
})
export class AuthLoginFacade extends AbstractFacade<unknown> {
  constructor(protected geRx: GeRx, protected store: AuthLoginState) {
    super(geRx, store);
  }

  authorizationReq(req: AuthLoginInterface): void {
    this.geRx.exception(this.store.entityName, req);
  }
}
