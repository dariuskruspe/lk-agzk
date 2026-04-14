import { Injectable } from '@angular/core';
import { FileBase64 } from '@shared/models/files.interface';
import { FilesService } from '@shared/services/files.service';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { AgreementEmployeeDocumentPageReqInterface } from '../models/agreement-employee-document-page.interface';

@Injectable({
  providedIn: 'root',
})
export class AgreementEmployeeDocumentFileState {
  public entityName = 'agreementEmployeeDocumentFile';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.showOwnerFileBase64,
    },
  };

  constructor(private fileService: FilesService) {}

  showOwnerFileBase64(
    data: AgreementEmployeeDocumentPageReqInterface,
  ): Observable<FileBase64 | string | Blob> {
    return this.fileService.getFile('file', data.fileOwner, data.fileID, true);
  }
}
