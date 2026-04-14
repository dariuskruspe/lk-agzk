import { NgZone } from '@angular/core';
import {
  MonoTypeOperatorFunction,
  Observable,
  Observer,
  Operator,
  TeardownLogic,
} from 'rxjs';
import { map } from 'rxjs/operators';

class ZoneFreeOperator<T> implements Operator<T, T> {
  constructor(private ngZone: NgZone) {}

  call(observer: Observer<T>, source: Observable<T>): TeardownLogic {
    return this.ngZone.runOutsideAngular(() => source.subscribe(observer));
  }
}

export function zoneFull<T>(ngZone: NgZone): MonoTypeOperatorFunction<T> {
  return (source) => source.pipe(map((value) => ngZone.run(() => value)));
}

export function zoneFree<T>(ngZone: NgZone): MonoTypeOperatorFunction<T> {
  return (source) => source.lift(new ZoneFreeOperator<T>(ngZone));
}
