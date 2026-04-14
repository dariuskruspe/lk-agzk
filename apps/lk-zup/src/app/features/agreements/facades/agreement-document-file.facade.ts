import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { FileBase64 } from '../../../shared/models/files.interface';
import { AgreementDocumentPageReqInterface } from '../models/document.interface';
import { AgreementsDocumentItem } from '../models/agreement-document.interface';
import { AgreementDocumentFileState } from '../states/agreement-document-file.state';

@Injectable({
  providedIn: 'root',
})
export class AgreementDocumentFileFacade extends AbstractFacade<
  FileBase64 | string
> {
  constructor(
    protected geRx: GeRx,
    protected store: AgreementDocumentFileState
  ) {
    super(geRx, store);
  }

  getFileBase64(
    data: AgreementDocumentPageReqInterface | AgreementsDocumentItem
  ): void {
    this.show(data);
  }
}
