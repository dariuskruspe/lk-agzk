import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { MyDocumentsListState } from '../states/my-documents-list.state';
import { AbstractDocumentListFacade } from './abstract-document-list-facade.service';

@Injectable({
  providedIn: 'root',
})
export class MyDocumentsListFacade extends AbstractDocumentListFacade {
  constructor(
    protected geRx: GeRx,
    protected store: MyDocumentsListState,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store, localstorageService);
  }
}
