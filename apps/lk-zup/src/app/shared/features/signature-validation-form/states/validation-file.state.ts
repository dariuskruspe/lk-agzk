import { Injectable } from '@angular/core';
import { AgreementDocumentPageReqInterface } from '@features/agreements/models/document.interface';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { FilesService } from '../../../services/files.service';

@Injectable({
  providedIn: 'root',
})
export class ValidationFileState {
  public entityName = 'validationFile';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getFile,
    },
  };

  constructor(private fileService: FilesService) {}

  getFile(data: AgreementDocumentPageReqInterface): Observable<Blob> {
    return this.fileService.getFileBlob('file', data.fileOwner, data.fileID, {
      forSign: true,
    });
  }
}
