import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthFactor2CodeService {
  constructor(public http: HttpClient) {}

  initCode(): Observable<{ success: true }> {
    return this.http.post<{ success: true }>(
      `${Environment.inv().api}/wa_users/2FA/init`,
      null
    );
  }

  codeValidate(data: { code: string }): Observable<void> {
    return this.http.post<void>(
      `${Environment.inv().api}/wa_users/2FA/validate`,
      data
    );
  }
}
