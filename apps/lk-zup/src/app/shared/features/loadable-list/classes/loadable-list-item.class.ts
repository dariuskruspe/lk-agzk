import { Injectable, Type } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadableListItemClass {
  constructor(
    public component: Type<unknown>,
    public componentDataList: unknown
  ) {}
}
