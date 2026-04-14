import { Injectable } from '@angular/core';
import { DocumentApiService } from '../services/document-api.service';
import { AbstractDocumentListState } from './abstract-document-list-state.service';
// todo delete
@Injectable({
  providedIn: 'root',
})
export class MyDocumentsListState extends AbstractDocumentListState {
  public entityName = 'myDocumentsList';

  constructor(protected documentAPI: DocumentApiService) {
    super(documentAPI);
  }
}
