import { Injectable } from '@angular/core';
import {
  DocumentFilterInterface,
  DocumentListInterface,
} from '@features/agreements/models/agreement.interface';
import { AbstractDocumentListState } from '@features/agreements/states/abstract-document-list-state.service';
import { AbstractFacade } from '@shared/classes/abstractions/abstract.facade';
import { SignRoles } from '@shared/features/signature-file/models/sign-roles.enum';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { GeRx } from 'gerx';

@Injectable({
  providedIn: 'root',
})
export class AbstractDocumentListFacade extends AbstractFacade<DocumentListInterface> {
  protected additionalParams: DocumentFilterInterface = {
    forEmployee: 'true',
    role: SignRoles.employee,
  };

  constructor(
    protected geRx: GeRx,
    protected store: AbstractDocumentListState,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getDocumentList(filter?: DocumentFilterInterface): void {
    const params: {
      currentEmployeeId: string;
      filterData?: DocumentFilterInterface;
    } = {
      currentEmployeeId: this.localstorageService.getCurrentEmployeeId(),
    };
    if (filter) {
      params.filterData = filter;
    }
    if (Object.keys(this.additionalParams).length) {
      Object.assign(params.filterData, this.additionalParams);
    }
    this.geRx.show(this.store.entityName, params);
  }

  setAdditionalParams(params: DocumentFilterInterface): void {
    this.additionalParams = params;
  }

  getAdditionalParams(): DocumentFilterInterface {
    return this.additionalParams;
  }
}
