import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { DocumentListState } from '../states/agreement-list.state';
import { AbstractDocumentListFacade } from './abstract-document-list-facade.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentListFacade extends AbstractDocumentListFacade {
  constructor(
    protected geRx: GeRx,
    protected store: DocumentListState,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store, localstorageService);
  }
}
