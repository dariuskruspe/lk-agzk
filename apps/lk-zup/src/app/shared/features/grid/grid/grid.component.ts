import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { GridService } from '../shared/grid.service';
import { GridConfig } from '../shared/types';

@Component({
  selector: 'app-grid',
  imports: [],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [GridService],
})
export class GridComponent {
  private gridService = inject(GridService);

  config = input<GridConfig>({
    className: '',
  });
  minWidth = input<string>();

  constructor() {
    effect(() => {
      this.gridService.config.set(this.config());
    });
  }
}
