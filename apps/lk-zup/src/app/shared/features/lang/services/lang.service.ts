import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../classes/ennvironment/environment';
import { LangInterface } from '../interfaces/lang.interface';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  constructor(public http: HttpClient) {}

  getLang(): Observable<LangInterface> {
    return this.http.get<LangInterface>(
      `${Environment.inv().apiRoot}/wa_global/systemLanguage`
    );
  }
}
