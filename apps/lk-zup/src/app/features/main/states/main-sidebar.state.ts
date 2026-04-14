import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainSidebarState {
  public entityName = 'sidebar';

  public geRxMethods: GeRxMethods = {
    exception: {
      main: this.setSidebarState,
    },
  };

  setSidebarState(isOpened: boolean): Observable<boolean> {
    return of(isOpened);
  }
}
