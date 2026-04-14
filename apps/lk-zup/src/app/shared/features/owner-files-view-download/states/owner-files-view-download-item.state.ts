import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { OwnerFilesViewDownloadItemParamsInterface } from '../models/owner-files-view-download-params.interface';
import { OwnerFilesViewDownloadItemInterface } from '../models/owner-files-view-download.interface';
import { OwnerFilesViewDownloadService } from '../services/owner-files-view-download.service';

@Injectable({
  providedIn: 'root',
})
export class OwnerFilesViewDownloadItemState {
  public entityName = 'ownerFilesViewDownloadItem';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getOwnerFile,
    },
  };

  constructor(
    private ownerFilesViewDownloadService: OwnerFilesViewDownloadService
  ) {}

  getOwnerFile(
    params: OwnerFilesViewDownloadItemParamsInterface
  ): Observable<OwnerFilesViewDownloadItemInterface> {
    return this.ownerFilesViewDownloadService.getOwnerFile(params);
  }
}
