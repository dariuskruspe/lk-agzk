import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Observer } from '../../../../../../node_modules/rxjs/src/internal/types';

/*
Утилита для упрощения работы с отменами observable подписок
Удобно использовать в http запросах, чтобы сделать singleton запрос
*/

export function autoaborted() {
  let abortController = new AbortController();

  const loadingSubj = new BehaviorSubject<boolean>(false);

  function autoabortedInstance<T>(params: {
    obs: Observable<T>;
    next?: (value: T) => void;
    error?: (error: unknown) => void;
    aborted?: () => void;
  }) {
    abortController.abort();
    abortController = new AbortController();

    const onError = (error: unknown) => {
      loadingSubj.next(false);
      params.error?.(error);
    };
    const onAbort = () => {
      abortController.abort();
      params.aborted?.();
    };

    const onNext = (value: T) => {
      loadingSubj.next(false);
      params.next?.(value);
    };

    loadingSubj.next(true);

    const sub = params.obs.subscribe({
      next: onNext,
      error: onError,
    });

    abortController.signal.addEventListener('abort', onAbort);

    return sub;
  }

  autoabortedInstance.loading$ = loadingSubj.asObservable();

  return autoabortedInstance;
}
