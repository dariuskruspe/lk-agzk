import { Injectable } from '@angular/core';
import { UsersProfileDownloadArchState } from '@features/users/states/users-profile-download-arch.state';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';

@Injectable({
  providedIn: 'root',
})
export class UsersProfileDownloadArchFacade extends AbstractFacade<any> {
  constructor(
    protected geRx: GeRx,
    protected store: UsersProfileDownloadArchState
  ) {
    super(geRx, store);
  }
}
