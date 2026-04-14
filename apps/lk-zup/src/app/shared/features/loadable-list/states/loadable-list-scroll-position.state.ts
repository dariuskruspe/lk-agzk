import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadableListScrollPositionState {
  public entityName = 'loadableListScrollPosition';

  public geRxMethods: GeRxMethods = {
    edit: {
      main: this.savePosition,
    },
  };

  savePosition(position: number): Observable<{ position: number }> {
    return of({ position });
  }
}
