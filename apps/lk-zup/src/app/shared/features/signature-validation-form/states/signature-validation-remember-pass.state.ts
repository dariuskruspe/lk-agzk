import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignatureValidationRememberPassState {
  public entityName = 'signatureValidationRememberPass';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.savePassword,
    },
  };

  savePassword(value: string): Observable<string> {
    return of(value);
  }
}
