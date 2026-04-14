import { Injectable } from '@angular/core';
import { DocumentApiService } from '@features/agreements/services/document-api.service';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  DocumentInterface,
  GetDocumentParamsInterface,
} from '../models/document.interface';

@Injectable({
  providedIn: 'root',
})
export class DocumentState {
  public entityName = 'document';

  public dialogRef;

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getDocument,
    },
  };

  constructor(private documentAPI: DocumentApiService) {}

  getDocument(
    params: GetDocumentParamsInterface
  ): Observable<DocumentInterface> {
    return this.documentAPI
      .getDocument(params)
      .pipe(map((result) => ({ ...result, forEmployee: params.forEmployee })));
  }
}
