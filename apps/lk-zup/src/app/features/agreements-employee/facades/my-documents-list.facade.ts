import { Injectable } from '@angular/core';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { GeRx } from 'gerx';
import { MyDocumentsListState } from '../states/my-documents-list.state';
import { AbstractAgreementEmployeeListFacade } from './abstract-agreement-employee-list.facade';

@Injectable({
  providedIn: 'root',
})
export class MyDocumentsListFacade extends AbstractAgreementEmployeeListFacade {
  constructor(
    protected geRx: GeRx,
    protected store: MyDocumentsListState,
    protected localStorageService: LocalStorageService
  ) {
    super(geRx, store, localStorageService);
  }
}
