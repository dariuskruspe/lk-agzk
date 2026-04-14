import { EventEmitter } from '@angular/core';

export interface LoadableListComponentInterface {
  dataList?: unknown;
  otherData?: unknown;
  clickItem?: EventEmitter<unknown>;
}
