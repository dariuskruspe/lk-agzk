import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import {
  AuthRestorePasswordInterface,
  AuthRestorePasswordNewInterface,
} from '../models/auth-restore-password.interface';
import { AuthRestorePasswordState } from '../states/auth-restore-password.state';

@Injectable({
  providedIn: 'root',
})
export class AuthRestorePasswordFacade extends AbstractFacade<void> {
  constructor(protected geRx: GeRx, protected store: AuthRestorePasswordState) {
    super(geRx, store);
  }

  checkLinkValidity(userData: string): void {
    this.geRx.delete(this.store.entityName, { userData });
  }

  restore(req: AuthRestorePasswordInterface): void {
    this.geRx.exception(this.store.entityName, req);
  }

  setPass(data: AuthRestorePasswordNewInterface): void {
    this.geRx.edit(this.store.entityName, data);
  }
}
