import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { DocumentApiService } from '../services/document-api.service';

@Injectable({
  providedIn: 'root',
})
export class AgreementSigningFilesState {
  public entityName = 'agreementSigningFiles';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.signFiles,
    },
  };

  constructor(private documentAPI: DocumentApiService) {}

  signFiles(data: {
    files: { fileID: string; owner: string; signInfo: { sig: string } }[];
    signInfo: { provider: string };
  }): Observable<{ signingData: { fileID: string; errorMsg: string }[] }> {
    return this.documentAPI.signFiles(data);
  }
}
