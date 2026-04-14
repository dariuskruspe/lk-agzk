import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { IssuesManagementApproveResponse } from '../models/issues-management-list.interfaces';
import { IssuesApprovingListState } from '../states/issues-approving-list.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesApprovingListFacade extends AbstractFacade<
  IssuesManagementApproveResponse[]
> {
  constructor(protected geRx: GeRx, protected store: IssuesApprovingListState) {
    super(geRx, store);
  }
}
