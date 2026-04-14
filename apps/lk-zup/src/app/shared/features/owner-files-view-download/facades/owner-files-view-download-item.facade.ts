import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../classes/abstractions/abstract.facade';
import {
  OwnerFilesViewDownloadItemParamsInterface,
  OwnerFilesViewDownloadListParamsInterface,
} from '../models/owner-files-view-download-params.interface';
import {
  OwnerFilesViewDownloadItemInterface,
  OwnerFilesViewDownloadListInterface,
} from '../models/owner-files-view-download.interface';
import { OwnerFilesViewDownloadItemState } from '../states/owner-files-view-download-item.state';

@Injectable({
  providedIn: 'root',
})
export class OwnerFilesViewDownloadItemFacade extends AbstractFacade<OwnerFilesViewDownloadItemInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: OwnerFilesViewDownloadItemState
  ) {
    super(geRx, store);
  }

  getOwnerFile(
    ownerFileListParam: OwnerFilesViewDownloadListParamsInterface,
    fileListItem: OwnerFilesViewDownloadListInterface
  ): void {
    const params: OwnerFilesViewDownloadItemParamsInterface = {};
    params.ownerId = ownerFileListParam.ownerId;
    params.ownerType = ownerFileListParam.ownerType;
    params.fileID = fileListItem.fileID;
    params.reqScript = fileListItem.reqScript;
    this.show(params);
  }
}
