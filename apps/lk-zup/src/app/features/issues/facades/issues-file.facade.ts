import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { FileBase64 } from '../../../shared/models/files.interface';
import { IssuesFileState } from '../states/issues-file.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesFileFacade extends AbstractFacade<FileBase64> {
  constructor(protected geRx: GeRx, protected store: IssuesFileState) {
    super(geRx, store);
  }

  showIssueFileBase64(id: string): void {
    this.geRx.show(this.store.entityName, id);
  }

  showIssueBase64(id: string): void {
    this.geRx.exception(this.store.entityName, id);
  }
}
