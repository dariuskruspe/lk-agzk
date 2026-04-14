import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../classes/abstractions/abstract.facade';
import { SignatureValidationRememberPassState } from '../states/signature-validation-remember-pass.state';

@Injectable({
  providedIn: 'root',
})
export class SignatureValidationRememberPassFacade extends AbstractFacade<string> {
  constructor(
    protected geRx: GeRx,
    protected store: SignatureValidationRememberPassState
  ) {
    super(geRx, store);
  }
}
