import { Observable, take } from 'rxjs';

export function toPromise<T>(
  observable: Observable<T>,
  abortSignal?: AbortSignal,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const sub = observable.pipe(take(1)).subscribe({
      next: resolve,
      error: reject,
    });

    if (abortSignal) {
      abortSignal.addEventListener('abort', () => {
        sub.unsubscribe();
        reject(new Error('Aborted'));
      });
    }
  });
}
