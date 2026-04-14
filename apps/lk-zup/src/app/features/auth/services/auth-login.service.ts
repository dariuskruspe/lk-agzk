import { HttpBackend, HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import {
  AuthLoginInterface,
  AuthTokenInterface,
} from '../models/auth-login.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthLoginService {
  private backend = inject(HttpBackend);

  private http = inject(HttpClient);

  authorization(authData: AuthLoginInterface): Observable<AuthTokenInterface> {
    return this.http.post<AuthTokenInterface>(
      `${Environment.inv().api}/wa_users/login`,
      authData,
    );
  }

  logout(id: string): Observable<void> {
    return this.http.post<void>(`${Environment.inv().api}/wa_users/logout`, {
      userID: id,
    });
  }

  showErrors(form: FormGroup): void {
    Object.entries(form.controls).forEach(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, control]: [string, AbstractControl]) => {
        if (control instanceof FormGroup) {
          this.showErrors(control);
        }
        if (control.invalid) {
          control.markAsTouched();
          control.markAsDirty({ onlySelf: true });
          control.setErrors({ required: true });
        }
      },
    );
  }
}
