import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../classes/ennvironment/environment';
import {
  OwnerFilesViewDownloadItemParamsInterface,
  OwnerFilesViewDownloadListParamsInterface,
} from '../models/owner-files-view-download-params.interface';
import {
  OwnerFilesViewDownloadItemInterface,
  OwnerFilesViewDownloadListInterface,
} from '../models/owner-files-view-download.interface';

@Injectable({
  providedIn: 'root',
})
export class OwnerFilesViewDownloadService {
  constructor(private http: HttpClient) {}

  getOwnerFilesList(
    params: OwnerFilesViewDownloadListParamsInterface
  ): Observable<OwnerFilesViewDownloadListInterface[]> {
    return this.http.get<OwnerFilesViewDownloadListInterface[]>(
      `${Environment.inv().api}/wa_global/files/${params.ownerType}/${
        params.ownerId
      }`
    );
  }

  getOwnerFile(
    params: OwnerFilesViewDownloadItemParamsInterface
  ): Observable<OwnerFilesViewDownloadItemInterface> {
    return this.http.get<OwnerFilesViewDownloadItemInterface>(
      `${Environment.inv().api}/wa_global/fileBase64/${params.ownerType}/${
        params.ownerId
      }/${params.fileID}/${params.reqScript}`
    );
  }
}
