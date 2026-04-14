import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { UsersProfilePasswordInterface } from '../models/users-profile-password.interface';
import { UsersProfilePasswordState } from '../states/users-profile-password.state';

@Injectable({
  providedIn: 'root',
})
export class UsersProfilePasswordFacade extends AbstractFacade<{
  success: boolean;
}> {
  constructor(
    protected geRx: GeRx,
    protected store: UsersProfilePasswordState
  ) {
    super(geRx, store);
  }

  changePass(req: UsersProfilePasswordInterface): void {
    delete req.confirmPass;
    this.geRx.edit(this.store.entityName, req);
  }
}
