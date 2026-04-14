import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';
import { AuthFactor2CodeService } from '../services/auth-factor2-code.service';

@Injectable({
  providedIn: 'root',
})
export class AuthFactor2CodeState {
  public entityName = 'authFactor2Code';

  public geRxMethods: GeRxMethods = {
    add: {
      main: this.initCode,
    },
    exception: {
      main: this.codeValidate,
      success: this.codeValidateSuccess,
    },
  };

  constructor(
    private router: Router,
    private authFactor2CodeService: AuthFactor2CodeService
  ) {}

  initCode(): Observable<{ success: true }> {
    return this.authFactor2CodeService.initCode();
  }

  codeValidate(data: { code: string }): Observable<void> {
    return this.authFactor2CodeService.codeValidate(data);
  }

  codeValidateSuccess(): Observable<void | Promise<boolean>> {
    return of(this.router.navigate(['']));
  }
}
