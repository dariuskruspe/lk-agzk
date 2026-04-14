import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactsInterface } from '../models/contact.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactApiService {
  constructor(private http: HttpClient) {}

  sendContacts(data: ContactsInterface): Observable<void> {
    return this.http.post<void>(
      `https://api.9958258.ru/erp/v1/pushordertoerp`,
      {
        ...data,
        type: 0,
      }
    );
  }
}
