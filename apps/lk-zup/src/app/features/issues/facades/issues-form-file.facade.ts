import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { FileBase64, FileOwners } from '../../../shared/models/files.interface';
import { IssuesFormFileState } from '../states/issues-form-file.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesFormFileFacade extends AbstractFacade<FileBase64 | string> {
  constructor(protected geRx: GeRx, protected store: IssuesFormFileState) {
    super(geRx, store);
  }

  getFileBase64(id: string): void {
    this.geRx.show(this.store.entityName, id);
  }

  showIssueFileOwnerBase64(data: { id: string; ownerType: FileOwners }): void {
    this.geRx.exception(this.store.entityName, data);
  }
}
