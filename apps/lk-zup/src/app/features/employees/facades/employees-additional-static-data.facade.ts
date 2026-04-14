import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { IssuesAddInterface } from '../../issues/models/issues-add.interface';
import { EmployeesAdditionalStaticDataStates } from '../states/employees-additional-static-data.states';

@Injectable({
  providedIn: 'root',
})
export class EmployeesAdditionalStaticDataFacade extends AbstractFacade<IssuesAddInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: EmployeesAdditionalStaticDataStates,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getUpdatingStaticData(fields: string[]): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.show({ currentEmployeeId, fields });
  }
}
