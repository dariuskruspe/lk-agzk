import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { IssuesAddInterface } from '../../issues/models/issues-add.interface';
import { EmployeesStaticDataStates } from '../states/employees-static-data.states';

@Injectable({
  providedIn: 'root',
})
export class EmployeesStaticDataFacade extends AbstractFacade<IssuesAddInterface> {
  private staticDataRequestedOnce = false;

  constructor(
    protected geRx: GeRx,
    protected store: EmployeesStaticDataStates,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getStaticData(): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.show(currentEmployeeId);
  }

  getStaticDataOnce(): void {
    if (this.getData() || this.staticDataRequestedOnce) {
      return;
    }

    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    if (!currentEmployeeId) {
      return;
    }

    this.staticDataRequestedOnce = true;
    this.show(currentEmployeeId);
  }

  setCurrentEmployeeId(employeeId: string): void {
    this.localstorageService.setCurrentEmployeeId(employeeId);
  }
}
