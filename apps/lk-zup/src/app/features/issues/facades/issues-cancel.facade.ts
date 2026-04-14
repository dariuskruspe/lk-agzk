import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { IssueCancelInterface } from '../models/issues.interface';
import { IssuesCancelState } from '../states/issues-cancel.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesCancelFacade extends AbstractFacade<unknown> {
  constructor(protected geRx: GeRx, protected store: IssuesCancelState) {
    super(geRx, store);
  }

  issueCancel(body: IssueCancelInterface): void {
    this.geRx.edit(this.store.entityName, body);
  }
}
