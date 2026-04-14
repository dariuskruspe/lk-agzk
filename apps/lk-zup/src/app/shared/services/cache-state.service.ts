import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Environment } from '../classes/ennvironment/environment';
import { firstValueFrom, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CacheStateService {
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);

  value = signal<any>(null);

  async fetch() {
    const currentEmployeeId = this.localStorageService.getCurrentEmployeeId();
    const url = `${Environment.inv().api}/wa_employee/${currentEmployeeId}/cache/changedTime`;
    const response = await firstValueFrom(this.http.get<any>(url));
    this.value.set(response);
  }
}
