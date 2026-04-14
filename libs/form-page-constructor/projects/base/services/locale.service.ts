import { Injectable } from '@angular/core';
import moment from 'moment';
import { PrimeNGConfig } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  constructor(private primeConfig: PrimeNGConfig) {
  }

  private locale: string;

  setLocale(value: string): void {
    this.locale = value;
    moment.locale(value);
  }

  get value(): string {
    return this.locale || 'ru';
  }
}
