import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Environment } from '../classes/ennvironment/environment';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private cryptoJS = CryptoJS;

  encrypt(data: unknown): string {
    return this.cryptoJS.AES.encrypt(
      JSON.stringify(data),
      Environment.inv().sk
    ).toString();
  }

  decrypt(data: string): unknown {
    const bytes = this.cryptoJS.AES.decrypt(
      decodeURI(data).replace(/ /g, '+'),
      Environment.inv().sk
    );
    try {
      return JSON.parse(bytes.toString(this.cryptoJS.enc.Utf8));
    } catch (e) {
      return {};
    }
  }
}
