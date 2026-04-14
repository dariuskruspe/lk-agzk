import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { AuthFactor2CodeState } from '../states/auth-factor2-code.state';

@Injectable({
  providedIn: 'root',
})
export class AuthFactor2CodeFacade extends AbstractFacade<unknown> {
  constructor(protected geRx: GeRx, protected store: AuthFactor2CodeState) {
    super(geRx, store);
  }

  codeValidate(data: { code: string }): void {
    const modData: { code?: number } = {};
    modData.code = +data.code.replace(/\s/g, '');
    this.geRx.exception(this.store.entityName, modData);
  }
}
