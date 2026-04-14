import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { AgreementSigningFilesState } from '../states/agreement-signing-files.state';

@Injectable({
  providedIn: 'root',
})
export class AgreementSigningFilesFacade extends AbstractFacade<{
  signingData: { fileID: string; errorMsg: string }[];
  displayConfirmationCodeWindow: boolean;
}> {
  constructor(
    protected geRx: GeRx,
    protected store: AgreementSigningFilesState,
  ) {
    super(geRx, store);
  }
}
