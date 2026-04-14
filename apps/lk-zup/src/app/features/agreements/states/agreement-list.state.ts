import { Injectable } from '@angular/core';
import { DocumentApiService } from '../services/document-api.service';
import { AbstractDocumentListState } from './abstract-document-list-state.service';
// todo delete
@Injectable({
  providedIn: 'root',
})
export class DocumentListState extends AbstractDocumentListState {
  public entityName = 'documentList';

  constructor(protected documentAPI: DocumentApiService) {
    super(documentAPI);
  }
}
