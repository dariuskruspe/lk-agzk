import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '@shared/classes/abstractions/abstract.facade';
import { AgreementEmployeeSigningFilesState } from '../states/agreement-employee-signing-files.state';

@Injectable({
  providedIn: 'root',
})
export class AgreementEmployeeSigningFilesFacade extends AbstractFacade<{
  signingData: { fileID: string; errorMsg: string }[];
}> {
  constructor(
    protected geRx: GeRx,
    protected store: AgreementEmployeeSigningFilesState
  ) {
    super(geRx, store);
  }
}
