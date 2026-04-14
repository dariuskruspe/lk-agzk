import { Injectable, signal } from '@angular/core';

@Injectable()
export class AppSelectButtonService {
  value = signal<unknown>(null);

  select(value: unknown) {
    this.value.set(value);
  }
}
