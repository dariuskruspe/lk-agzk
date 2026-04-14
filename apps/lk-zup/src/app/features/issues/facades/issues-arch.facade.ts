import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { FileBase64 } from '../../../shared/models/files.interface';
import { IssuesArchState } from '../states/issues-arch.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesArchFacade extends AbstractFacade<FileBase64> {
  constructor(protected geRx: GeRx, protected store: IssuesArchState) {
    super(geRx, store);
  }

  getIssuesArchAll(issueId: string): void {
    this.show(issueId);
  }
}
