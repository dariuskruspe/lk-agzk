import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function combineLoadings(
  ...loading: Observable<boolean>[]
): Observable<boolean> {
  return combineLatest(loading).pipe(
    map((result) => result.some((v) => v !== false))
  );
}

export function combineDataExistence(
  ...hasData: Observable<boolean>[]
): Observable<boolean> {
  return combineLatest(hasData).pipe(
    map((result) => result.every((v) => v !== false))
  );
}
