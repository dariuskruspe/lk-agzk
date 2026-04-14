import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { IssuesAddInterface } from '../../issues/models/issues-add.interface';
import { EmployeesStaticDataManagerStates } from '../states/employees-static-data-manager.states';

@Injectable({
  providedIn: 'root',
})
export class EmployeesStaticDataManagerFacade extends AbstractFacade<IssuesAddInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: EmployeesStaticDataManagerStates,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getStaticData(employeeId: string, fields: string[]): void {
    this.show({ currentEmployeeId: employeeId, fields });
  }
}
