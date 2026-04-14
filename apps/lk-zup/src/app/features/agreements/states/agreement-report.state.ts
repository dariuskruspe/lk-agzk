import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { FileBase64 } from '../../../shared/models/files.interface';
import { FilesService } from '../../../shared/services/files.service';

@Injectable({
  providedIn: 'root',
})
export class AgreementReportState {
  public entityName = 'agreementReport';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getAgreementDocument,
    },
  };

  constructor(private filesService: FilesService) {}

  getAgreementDocument({
    filePath,
  }: {
    filePath: string;
  }): Observable<string | FileBase64 | Blob> {
    return this.filesService.getFile('file', 'agreement', filePath, true);
  }
}
