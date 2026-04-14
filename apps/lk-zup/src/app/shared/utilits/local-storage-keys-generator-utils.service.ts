import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageKeysGeneratorUtils {
  static storageKey(name: string): string {
    const baseHref = environment.baseHref.split('/')[1];
    return baseHref ? `${name}-${baseHref}` : name;
  }

  storageKey(name: string): string {
    const baseHref = environment.baseHref.split('/')[1];
    return baseHref ? `${name}-${baseHref}` : name;
  }
}
