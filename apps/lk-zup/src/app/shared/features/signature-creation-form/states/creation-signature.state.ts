import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { SignatureRequiredState } from '../../../classes/abstractions/signature-required.state';
import { CreationSignatureApiService } from '../services/creation-signature-api.service';

@Injectable({
  providedIn: 'root',
})
export class CreationSignatureState extends SignatureRequiredState {
  public entityName = 'creationSignature';

  public geRxMethods: GeRxMethods = {
    add: {
      main: this.creationSignatureApi.createSignature.bind(
        this.creationSignatureApi
      ),
      success: this.onSignSuccess,
      error: this.onSignError,
    },
  };

  constructor(private creationSignatureApi: CreationSignatureApiService) {
    super();
  }
}
