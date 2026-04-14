import { HttpClient } from '@angular/common/http';
import {
  computed,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { GetCodeResponseInterface } from '../models/auth-sms-interface';

@Injectable({
  providedIn: 'root',
})
export class AuthSmsService {
  /**
   * Сигнал, содержащий ответ (response) от метода отправки SMS-кода на указанный пользователем номер мобильного
   * телефона для подтверждения авторизации.
   */
  getCodeResponseSignal: WritableSignal<GetCodeResponseInterface> =
    signal(null);

  /**
   * Сигнал, содержащий значение true или false в зависимости от того, отправлен ли SMS-код на номер мобильного
   * телефона, указанный пользователем.
   */
  codeSentSignal: Signal<boolean> = computed(
    () => this.getCodeResponseSignal()?.success
  );

  constructor(private http: HttpClient) {}

  getCode(number: string): Observable<GetCodeResponseInterface> {
    return this.http.post<GetCodeResponseInterface>(
      `${Environment.inv().api}/wa_users/sendOneTimePassword/`,
      {
        phoneNumber: number,
      }
    );
  }
}
