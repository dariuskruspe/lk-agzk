import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from '@shared/classes/ennvironment/environment';
import {
  FileBase64,
  FileOwners,
  FileType,
} from '@shared/models/files.interface';
import { isNil } from 'lodash';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FilesService {
  constructor(private http: HttpClient) {}

  getFile(
    fileType: FileType,
    fileOwner: FileOwners,
    filePath: string,
    base64: boolean,
    httpParams: any = {}
  ): Observable<FileBase64 | string | Blob> {
    if (isNil(httpParams.forEmployee)) {
      httpParams.forEmployee = true;
    }

    return this.http.get<FileBase64 | string | Blob>(
      `${Environment.inv().api}/wa_global/${fileType}/${fileOwner}/${filePath}${
        base64 ? '/base64' : ''
      }`,
      {
        responseType: (base64 ? 'json' : 'blob') as any,
        params: httpParams ?? {},
      }
    );
  }

  getFileBase64(
    fileType: FileType,
    fileOwner: FileOwners,
    filePath: string,
    httpParams: any = {}
  ): Observable<FileBase64 | string> {
    const apiURL: string = Environment.inv().api;
    return this.http.get<FileBase64 | string>(
      `${apiURL}/wa_global/${fileType}/${fileOwner}/${filePath}/base64`,
      {
        params: httpParams ?? {},
      }
    );
  }

  getFileBlob(
    fileType: FileType,
    fileOwner: FileOwners,
    filePath: string,
    httpParams: any = {}
  ): Observable<Blob> {
    return this.http.get(
      `${Environment.inv().api}/wa_global/${fileType}/${fileOwner}/${filePath}`,
      {
        responseType: 'blob',
        params: httpParams,
      }
    );
  }
}
