import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScrollPositionState {
  public entityName = 'scrollPosition';

  public geRxMethods: GeRxMethods = {
    edit: {
      main: this.showSettings,
    },
  };

  showSettings(position: number): Observable<{ position: number }> {
    return of({ position });
  }
}
