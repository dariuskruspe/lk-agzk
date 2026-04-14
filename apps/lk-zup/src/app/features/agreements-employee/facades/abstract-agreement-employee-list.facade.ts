import { Injectable } from '@angular/core';
import { AbstractFacade } from '@shared/classes/abstractions/abstract.facade';
import { SignRoles } from '@shared/features/signature-file/models/sign-roles.enum';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { GeRx } from 'gerx';
import {
  AgreementEmployeeFilterInterface,
  AgreementsEmployeeInterface,
} from '../models/agreement-employee.interface';
import { AbstractAgreementEmployeeListState } from '../states/abstract-agreement-employee-list.state';
@Injectable({
  providedIn: 'root',
})
export class AbstractAgreementEmployeeListFacade extends AbstractFacade<AgreementsEmployeeInterface> {
  protected additionalParams: AgreementEmployeeFilterInterface = {
    forEmployee: 'true',
    role: SignRoles.employee,
  };

  constructor(
    protected geRx: GeRx,
    protected store: AbstractAgreementEmployeeListState,
    protected localStorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getAgreementsEmployeeList(filter?: AgreementEmployeeFilterInterface): void {
    const params: {
      currentEmployeeId: string;
      filterData?: AgreementEmployeeFilterInterface;
    } = {
      currentEmployeeId: this.localStorageService.getCurrentEmployeeId(),
    };
    if (filter) {
      params.filterData = filter;
    }
    if (Object.keys(this.additionalParams).length) {
      Object.assign(params.filterData, this.additionalParams);
    }
    this.geRx.show(this.store.entityName, params);
  }

  setAdditionalParams(params: AgreementEmployeeFilterInterface): void {
    this.additionalParams = params;
  }

  getAdditionalParams(): AgreementEmployeeFilterInterface {
    return this.additionalParams;
  }
}
