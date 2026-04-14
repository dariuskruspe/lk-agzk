import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContactsInterface } from '@features/onboarding/interfaces/onboarding.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Environment } from '../../../classes/ennvironment/environment';
import { OnboardingBodyInterface } from '../models/onboarding.interface';

@Injectable({
  providedIn: 'root',
})
export class OnboardingApiService {
  constructor(private http: HttpClient) {}

  getSetup(): Observable<Partial<OnboardingBodyInterface>> {
    return this.http
      .get<Partial<string>>(`${Environment.inv().api}/wa_users/globalSettings`)
      .pipe(map((res) => JSON.parse(res ?? '{}')));
  }

  overwriteSetup(
    body: OnboardingBodyInterface
  ): Observable<OnboardingBodyInterface> {
    return this.http
      .post<string>(`${Environment.inv().api}/wa_users/globalSettings`, body)
      .pipe(map(() => body));
  }

  sendContacts(data: ContactsInterface): Observable<void> {
    return this.http.post<void>(
      `https://api.9958258.ru/erp/v1/pushordertoerp`,
      {
        ...data,
        type: 0,
        fromUrl: 'https://empldocs.1c-wiseadvice.ru/',
      }
    );
  }
}
