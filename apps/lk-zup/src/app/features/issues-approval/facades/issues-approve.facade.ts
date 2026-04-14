import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import {
  IssueApproveInterfaceError,
  IssueApproveInterfaceSuccess,
} from '../models/issue-approve.interface';
import { IssueApproveState } from '../states/issue-approve.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesApproveFacade extends AbstractFacade<
  IssueApproveInterfaceSuccess | IssueApproveInterfaceError
> {
  constructor(protected geRx: GeRx, protected store: IssueApproveState) {
    super(geRx, store);
  }
}
