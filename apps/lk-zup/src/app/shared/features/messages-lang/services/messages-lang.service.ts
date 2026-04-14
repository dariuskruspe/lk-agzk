import { HttpClient } from '@angular/common/http';
import { injectResource } from '../../../services/api-resource';
import { Environment } from '../../../classes/ennvironment/environment';
import { MessageLangResource } from '../resources/message-lang.resource';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessagesLangService {
  private messageLangResource = injectResource(MessageLangResource);

  constructor(private http: HttpClient) {}

  getMessagesLang() {
    return this.messageLangResource.asObservable();
  }

  setMessagesLang(language: string): Observable<{ language: string }> {
    this.messageLangResource.invalidateCache();

    return this.http.patch<{ language: string }>(
      `${Environment.inv().api}/wa_users/messageLanguage`,
      {
        language,
      },
    );
  }
}
