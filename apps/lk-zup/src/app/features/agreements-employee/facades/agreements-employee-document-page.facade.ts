import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractFacade } from '@shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { GeRx } from 'gerx';
import {
  AgreementEmployeeDocumentPageInterface,
  AgreementEmployeeDocumentPageReqInterface,
} from '../models/agreement-employee-document-page.interface';
import { AgreementEmployeeFilterInterface } from '../models/agreement-employee.interface';
import { AgreementEmployeeDocumentPageState } from '../states/agreement-employee-document-page.state';

@Injectable({
  providedIn: 'root',
})
export class AgreementsEmployeeDocumentPageFacade extends AbstractFacade<AgreementEmployeeDocumentPageInterface> {
  protected additionalParams: AgreementEmployeeFilterInterface = {};

  constructor(
    protected geRx: GeRx,
    protected store: AgreementEmployeeDocumentPageState,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getDocumentPage(data: AgreementEmployeeDocumentPageReqInterface): void {
    const modData = data;
    modData.forEmployee = this.router.url.split('/')[1] !== 'documents';
    modData.currentEmployeeId = this.localStorageService.getCurrentEmployeeId();
    this.geRx.show(this.store.entityName, modData);
  }

  setAdditionalParams(params: AgreementEmployeeFilterInterface): void {
    this.additionalParams = params;
  }
}
