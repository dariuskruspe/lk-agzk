import { GeRx } from 'gerx';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { startWith, take } from 'rxjs/operators';
import { StateInterface } from '../../models/state.interface';
import { SignatureRequiredState } from './signature-required.state';
import { Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

export class AbstractFacade<T> {
  dataSignal: Signal<T>;
  loadingSignal: Signal<boolean>;

  constructor(
    protected geRx: GeRx,
    protected store: StateInterface | (SignatureRequiredState & StateInterface),
  ) {
    this.initStore();
    this.dataSignal = toSignal(this.getData$());
    this.loadingSignal = toSignal(this.loading$());
  }

  get geRxMethods(): GeRxMethods {
    return this.store.geRxMethods;
  }

  get forcedData$(): Observable<T> {
    return this.getData$().pipe(startWith(this.getData()));
  }

  get forcedLoading$(): Observable<boolean> {
    return this.geRx
      .loading$(this.store.entityName)
      .pipe(startWith(this.geRx.loading(this.store.entityName)));
  }

  hasData$(): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      if (this.getData()) {
        subscriber.next(true);
        subscriber.complete();
      } else {
        subscriber.next(false);
        this.getData$()
          .pipe(take(1))
          .subscribe(() => {
            subscriber.next(true);
            subscriber.complete();
          });
      }
    });
  }

  show(params?: any): void {
    this.geRx.show(this.store.entityName, params);
  }

  edit(params?: any): void {
    this.geRx.edit(this.store.entityName, params);
  }

  add(params?: any): void {
    this.geRx.add(this.store.entityName, params);
  }

  delete(params?: any): void {
    this.geRx.delete(this.store.entityName, params);
  }

  exception(params?: any): void {
    this.geRx.exception(this.store.entityName, params);
  }

  getData$(): Observable<T> {
    return this.geRx.getData$(this.store.entityName);
  }

  onInit(cb: (v: T) => void): void {
    this.getData$()
      .pipe(take(1))
      .subscribe((v) => cb(v));
  }

  getData(): T {
    return this.geRx.getData(this.store.entityName);
  }

  loading$(): Observable<boolean> {
    return this.geRx
      .loading$(this.store.entityName)
      .pipe(startWith(this.geRx.loading(this.store.entityName)));
  }

  protected initStore(): void {
    this.geRx.addEntity(
      this.store.entityName,
      this.store.geRxMethods,
      this.store,
    );
  }
}
