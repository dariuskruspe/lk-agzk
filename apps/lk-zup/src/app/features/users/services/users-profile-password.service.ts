import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { UsersProfilePasswordInterface } from '../models/users-profile-password.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersProfilePasswordService {
  constructor(private http: HttpClient) {}

  changePass(
    passData: UsersProfilePasswordInterface
  ): Observable<{ success: boolean }> {
    return this.http.patch<{ success: boolean }>(
      `${Environment.inv().api}/wa_users/changePass`,
      passData
    );
  }
}
