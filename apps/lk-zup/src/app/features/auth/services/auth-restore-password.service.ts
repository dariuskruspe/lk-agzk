import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { convertToParams } from '../../../shared/utilits/convertToParams.utils';
import { AuthRestorePasswordInterface } from '../models/auth-restore-password.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthRestorePasswordService {
  constructor(public http: HttpClient) {}

  restorePassword(body: AuthRestorePasswordInterface): Observable<{
    email: string;
  }> {
    return this.http.post<{
      email: string;
    }>(`${Environment.inv().api}/wa_users/restorePass`, body);
  }

  setPassword(body: { userdata: string; newPass: string }): Observable<{
    userdata: string;
    newPass: string;
  }> {
    return this.http.patch<{
      userdata: string;
      newPass: string;
    }>(`${Environment.inv().api}/wa_users/setPass`, body);
  }

  checkLinkValidity(params: { userData: string }): Observable<void> {
    return this.http.get<void>(
      `${Environment.inv().api}/wa_users/isPasswordChangeLinkValid`,
      {
        params: convertToParams(params),
      }
    );
  }
}
