import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Environment } from '@shared/classes/ennvironment/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FileUploadService {
  // Angular

  private http = inject(HttpClient);

  uploadAvatar(employeeID: string, fileBlob: Blob): Observable<any> {
    return this.http.patch(
      `${Environment.inv().api}/wa_employee/${employeeID}/image`,
      fileBlob,
      {
        headers: new HttpHeaders({
          'Content-Type': fileBlob.type || 'image/jpeg',
        }),
      }
    );
  }
}
