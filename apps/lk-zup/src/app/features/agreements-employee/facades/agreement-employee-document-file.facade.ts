import { Injectable } from '@angular/core';
import { AbstractFacade } from '@shared/classes/abstractions/abstract.facade';
import { FileBase64 } from '@shared/models/files.interface';
import { GeRx } from 'gerx';
import { AgreementEmployeeDocumentPageReqInterface } from '../models/agreement-employee-document-page.interface';
import { AgreementsEmployeeDocumentItem } from '../models/agreement-employee-document.interface';
import { AgreementEmployeeDocumentFileState } from '../states/agreement-employee-document-file.state';

@Injectable({
  providedIn: 'root',
})
export class AgreementEmployeeDocumentFileFacade extends AbstractFacade<
  FileBase64 | string
> {
  constructor(
    protected geRx: GeRx,
    protected store: AgreementEmployeeDocumentFileState
  ) {
    super(geRx, store);
  }

  getFileBase64(
    data:
      | AgreementEmployeeDocumentPageReqInterface
      | AgreementsEmployeeDocumentItem
  ): void {
    this.show(data);
  }
}
