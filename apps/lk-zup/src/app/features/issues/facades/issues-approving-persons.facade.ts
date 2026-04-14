import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { IssuesApprovingPersonsState } from '../states/issues-approving-persons.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesApprovingPersonsFacade extends AbstractFacade<string[]> {
  constructor(
    protected geRx: GeRx,
    protected store: IssuesApprovingPersonsState,
    protected localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  showApprovingPersons(issueTypeID: string): void {
    const employeeID = this.localstorageService.getCurrentEmployeeId();
    this.geRx.show(this.store.entityName, {
      issueTypeID,
      employeeID,
    });
  }
}
