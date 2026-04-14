import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainUserMenuState {
  public entityName = 'userMenu';

  public geRxMethods: GeRxMethods = {
    exception: {
      main: this.setUserMenuState,
    },
  };

  setUserMenuState(isOpened: boolean): Observable<boolean> {
    return of(isOpened);
  }
}
