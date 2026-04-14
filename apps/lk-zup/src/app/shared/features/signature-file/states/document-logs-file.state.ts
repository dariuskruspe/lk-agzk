import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { DocSignatureInterface } from '../models/doc-signature.interface';
import { DocSignService } from '../services/doc-sign.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentLogsFileState {
  public entityName = 'documentLogsFile';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.setDocumentViewed,
    },
  };

  constructor(private docSignService: DocSignService) {}

  setDocumentViewed(data: DocSignatureInterface): Observable<string> {
    return this.docSignService.setDocViewed(
      data.fileOwner,
      data.id,
      data.forEmployee,
      data.availableRoles
    );
  }
}
