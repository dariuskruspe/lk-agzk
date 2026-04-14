import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';

@Injectable({
  providedIn: 'root',
})
export class IssuesFileService {
  constructor(private http: HttpClient) {}

  getFileBase64(fileId: string): Observable<{
    fileName: string;
    fileExtension: string;
    file64: string;
  }> {
    return this.http.get<{
      fileName: string;
      fileExtension: string;
      file64: string;
    }>(`${Environment.inv().api}/wa_global/file/issueFile/${fileId}/base64`);
  }
}
