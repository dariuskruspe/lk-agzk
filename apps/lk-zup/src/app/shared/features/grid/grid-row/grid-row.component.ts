import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
} from '@angular/core';
import { GridColComponent } from '../grid-col/grid-col.component';

@Component({
  selector: 'app-grid-row',
  imports: [],
  templateUrl: './grid-row.component.html',
  styleUrl: './grid-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridRowComponent {
  contentChildren = contentChildren(GridColComponent);

  gridTemplateColumns = computed(() =>
    this.contentChildren()
      .map((i) => i.size())
      .join(' '),
  );

  styles = computed(() => ({
    'grid-template-columns': this.gridTemplateColumns(),
  }));
}
