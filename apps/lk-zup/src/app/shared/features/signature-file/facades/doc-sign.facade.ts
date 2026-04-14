import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { SignableFacade } from '../../../classes/abstractions/signable.facade';
import { FileSignatureInterface } from '../models/doc-signature.interface';
import { DocSignState } from '../states/doc-sign.state';
import { SignRoles } from '../models/sign-roles.enum';

@Injectable({
  providedIn: 'root',
})
export class DocsSignFacade extends SignableFacade<unknown> {
  constructor(protected geRx: GeRx, protected store: DocSignState) {
    super(geRx, store);
  }

  sendForSignature(data: {
    files: FileSignatureInterface[];
    cancel?: boolean;
    comment?: string;
    forEmployee?: boolean;
    currentRole?: SignRoles;
  }): void {
    this.geRx.edit(this.store.entityName, data);
  }
}
