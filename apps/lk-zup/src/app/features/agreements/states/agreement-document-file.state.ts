import { Injectable } from '@angular/core';
import { FileContent } from '@shared/models/files.interface';
import { FilesService } from '@shared/services/files.service';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { AgreementDocumentPageReqInterface } from '../models/document.interface';

@Injectable({
  providedIn: 'root',
})
export class AgreementDocumentFileState {
  public entityName = 'agreementDocumentFile';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.showOwnerFileBase64,
    },
  };

  constructor(private fileService: FilesService) {}

  showOwnerFileBase64(
    data: AgreementDocumentPageReqInterface,
  ): Observable<FileContent> {
    return this.fileService.getFile('file', data.fileOwner, data.fileID, true);
  }
}
