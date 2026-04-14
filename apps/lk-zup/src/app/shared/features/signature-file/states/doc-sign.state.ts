import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { SignatureRequiredState } from '../../../classes/abstractions/signature-required.state';
import { SignatureResponseInterface } from '../../../models/signature-response.interface';
import { FileSignatureInterface } from '../models/doc-signature.interface';
import { DocSignService } from '../services/doc-sign.service';
import { SignRoles } from '../models/sign-roles.enum';

@Injectable({
  providedIn: 'root',
})
export class DocSignState extends SignatureRequiredState {
  public entityName = 'docSignState';

  public geRxMethods: GeRxMethods = {
    edit: {
      main: this.patchDocSign,
      success: this.patchDocSignSuccess,
      error: this.onSignError,
    },
  };

  constructor(private docSignService: DocSignService) {
    super();
  }

  patchDocSign(data: {
    files: FileSignatureInterface[];
    forEmployee?: boolean;
    cancel?: boolean;
    comment?: string;
    taskId?: string;
    currenRole: SignRoles;
  }): Observable<SignatureResponseInterface> {
    return this.docSignService.signDoc(data);
  }

  patchDocSignSuccess(result: unknown): Observable<unknown> {
    return this.onSignSuccess(result);
  }
}
