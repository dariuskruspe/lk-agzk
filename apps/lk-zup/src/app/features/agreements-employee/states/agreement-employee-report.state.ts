import { Injectable } from '@angular/core';
import { FileBase64 } from '@shared/models/files.interface';
import { FilesService } from '@shared/services/files.service';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AgreementEmployeeReportState {
  public entityName = 'agreementEmployeeReport';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getAgreementEmployeeDocument,
    },
  };

  constructor(private filesService: FilesService) {}

  getAgreementEmployeeDocument({
    filePath,
  }: {
    filePath: string;
  }): Observable<string | FileBase64 | Blob> {
    return this.filesService.getFile('file', 'agreement', filePath, true);
  }
}
