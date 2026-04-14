import { inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Environment } from '../classes/ennvironment/environment';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);

  private _cacheChangedTime = signal<any>(null);

  readonly cacheChangedTime = this._cacheChangedTime.asReadonly();

  // Получаем стейт локального кэша, чтобы понять, нужно ли сбрасывать кеш
  async fetchCacheChangedTime() {
    const currentEmployeeId = this.localStorageService.getCurrentEmployeeId();
    const url = `${Environment.inv().api}/wa_employee/${currentEmployeeId}/cache/changedTime`;
    const response = await firstValueFrom(this.http.get<any>(url));
    this._cacheChangedTime.set(response);
  }

  getSessionId = () => {
    const token = this.localStorageService.getTokens();
    if (!token) {
      return null;
    }
    // todo: hash token

    return token;
  };

  getCurrentEmployeeId = () => {
    return this.localStorageService.getCurrentEmployeeId();
  };

  getAccessToken = () => {
    const token = this.localStorageService.getTokens();
    if (!token) {
      return null;
    }

    return token;
  };
}

export const getCurrentEmployeeId = () => {
  const sessionService = inject(SessionService);
  return sessionService.getCurrentEmployeeId();
};

export const getSessionId = () => {
  const sessionService = inject(SessionService);
  return sessionService.getSessionId();
};
