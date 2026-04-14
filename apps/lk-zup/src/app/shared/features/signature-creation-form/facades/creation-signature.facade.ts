import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { SignableFacade } from '../../../classes/abstractions/signable.facade';
import { SignatureResponseInterface } from '../../../models/signature-response.interface';
import { CreationSignatureState } from '../states/creation-signature.state';

@Injectable({
  providedIn: 'root',
})
export class CreationSignatureFacade extends SignableFacade<SignatureResponseInterface> {
  constructor(protected geRx: GeRx, protected store: CreationSignatureState) {
    super(geRx, store);
  }
}
