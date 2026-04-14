import { signal } from '@angular/core';
import { firstValueFrom, isObservable, Observable } from 'rxjs';

export function signalProcess<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Observable<TResult> | Promise<TResult>,
) {
  const loading = signal(false);
  const error = signal<Error | null>(null);
  const data = signal<TResult | null>(null);

  const exec = (...args: TArgs) => {
    error.set(null);
    loading.set(true);

    let result = fn(...args);

    if (isObservable(result)) {
      result = firstValueFrom(result);
    }

    return result
      .then((result: TResult) => {
        loading.set(false);
        data.set(result);
        return result;
      })
      .catch((err) => {
        error.set(err);
        loading.set(false);
        throw err;
      });
  };

  return {
    exec,
    loading,
    error,
    data,
  };
}
