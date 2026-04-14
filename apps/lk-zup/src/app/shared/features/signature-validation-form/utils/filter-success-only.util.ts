import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ERROR } from '../constants/error';

export function filterSuccessOnly<T>(): (
  source: Observable<T | typeof ERROR>
) => Observable<T | typeof ERROR> {
  return function (source: Observable<T | typeof ERROR>) {
    return source.pipe(filter((data) => data !== ERROR));
  };
}
