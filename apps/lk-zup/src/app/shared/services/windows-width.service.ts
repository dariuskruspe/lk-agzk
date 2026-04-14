import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

// Keep in mind, that numbers are in pixels and included in the range.
export const BREAKPOINTS = {
  S: 575,
  M: 991,
  MOBILE: 769,
};

@Injectable({
  providedIn: 'root',
})
export class WindowsWidthService {
  private readonly resize = new BehaviorSubject<number>(
    document.body.clientWidth
  );

  constructor() {
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(50),
        map(() => document.body.clientWidth),
        distinctUntilChanged()
      )
      .subscribe(this.resize);
  }

  width$(): Observable<number> {
    return this.resize.asObservable();
  }

  lessThanOrEqualTo$(width: number = BREAKPOINTS.MOBILE): Observable<boolean> {
    return this.resize.asObservable().pipe(
      map((value: number) => value <= width),
      distinctUntilChanged()
    );
  }

  get size$(): Observable<'s' | 'm' | 'l'> {
    return this.resize.asObservable().pipe(
      map((value) => {
        return this.getSize(value);
      })
    );
  }

  getSize(value: number = document.body.clientWidth): 's' | 'm' | 'l' {
    switch (true) {
      case value <= BREAKPOINTS.S:
        return 's';
      case value > BREAKPOINTS.S && value <= BREAKPOINTS.M:
        return 'm';
      default:
        return 'l';
    }
  }

  isMobile(): boolean {
    return document.body.clientWidth <= BREAKPOINTS.MOBILE;
  }
}
