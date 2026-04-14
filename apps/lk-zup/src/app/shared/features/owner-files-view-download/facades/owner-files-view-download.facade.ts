import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../classes/abstractions/abstract.facade';
import { OwnerFilesViewDownloadListParamsInterface } from '../models/owner-files-view-download-params.interface';
import { OwnerFilesViewDownloadListInterface } from '../models/owner-files-view-download.interface';
import { OwnerFilesViewDownloadState } from '../states/owner-files-view-download.state';

@Injectable({
  providedIn: 'root',
})
export class OwnerFilesViewDownloadFacade extends AbstractFacade<OwnerFilesViewDownloadListInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: OwnerFilesViewDownloadState
  ) {
    super(geRx, store);
  }

  getOwnerFileList(params: OwnerFilesViewDownloadListParamsInterface): void {
    this.show(params);
  }
}
