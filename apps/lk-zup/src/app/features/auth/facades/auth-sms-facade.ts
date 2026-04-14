import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { GetCodeResponseInterface } from '../models/auth-sms-interface';
import { AuthSmsState } from '../states/auth-sms-state';

@Injectable({
  providedIn: 'root',
})
export class AuthSmsFacade extends AbstractFacade<GetCodeResponseInterface> {
  constructor(protected geRx: GeRx, protected store: AuthSmsState) {
    super(geRx, store);
  }

  getCode(number: string): void {
    this.geRx.add(this.store.entityName, number);
  }
}
