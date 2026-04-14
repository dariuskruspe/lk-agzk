import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { OwnerFilesViewDownloadListParamsInterface } from '../models/owner-files-view-download-params.interface';
import { OwnerFilesViewDownloadListInterface } from '../models/owner-files-view-download.interface';
import { OwnerFilesViewDownloadService } from '../services/owner-files-view-download.service';

@Injectable({
  providedIn: 'root',
})
export class OwnerFilesViewDownloadState {
  public entityName = 'ownerFilesViewListDownload';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getOwnerFileList,
    },
  };

  constructor(
    private ownerFilesViewDownloadService: OwnerFilesViewDownloadService
  ) {}

  getOwnerFileList(
    params: OwnerFilesViewDownloadListParamsInterface
  ): Observable<OwnerFilesViewDownloadListInterface[]> {
    return this.ownerFilesViewDownloadService.getOwnerFilesList(params);
  }
}
