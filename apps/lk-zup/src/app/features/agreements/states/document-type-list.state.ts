import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { DocumentApiService } from '../services/document-api.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentTypeListState {
  public entityName = 'documentTypesList';

  public geRxMethods: GeRxMethods = {
    exception: {
      main: this.documentAPI.getDocumentTypes.bind(this.documentAPI),
    },
  };

  constructor(protected documentAPI: DocumentApiService) {}
}
