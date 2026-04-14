import { Injectable, signal } from '@angular/core';
import { GridConfig } from './types';

@Injectable()
export class GridService {
  config = signal<GridConfig>({
    className: '',
  });
}
