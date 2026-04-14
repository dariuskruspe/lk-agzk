import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../classes/abstractions/abstract.facade';
import { OptionListItemInterface } from '../../option-list/models/option-list.interface';
import { IssueOptionListState } from '../states/issues-option-list.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesOptionListFacade extends AbstractFacade<
  OptionListItemInterface[]
> {
  constructor(protected geRx: GeRx, protected store: IssueOptionListState) {
    super(geRx, store);
  }

  showIssuesOptionLists(aliases: string[]): void {
    this.geRx.show(this.store.entityName, aliases);
  }
}
