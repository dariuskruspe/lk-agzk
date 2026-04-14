import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

type GridColSticky = 'left' | 'right';

@Component({
  selector: 'app-grid-col',
  host: {
    '[style.display]': '"block"',
    '[style.position]': 'stickyPosition()',
    '[style.left]': 'stickyLeft()',
    '[style.right]': 'stickyRight()',
    '[style.z-index]': 'stickyZIndex()',
    '[class.app-grid-col-host--sticky-left]': 'isStickyLeft()',
    '[class.app-grid-col-host--sticky-right]': 'isStickyRight()',
  },
  templateUrl: './grid-col.component.html',
  styleUrl: './grid-col.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridColComponent {
  styleClass = input<string>('');
  size = input<string>('1fr');
  sticky = input<GridColSticky>();

  isStickyLeft = computed(() => this.sticky() === 'left');
  isStickyRight = computed(() => this.sticky() === 'right');
  stickyPosition = computed(() => (this.sticky() ? 'sticky' : null));
  stickyLeft = computed(() => (this.isStickyLeft() ? '0px' : null));
  stickyRight = computed(() => (this.isStickyRight() ? '0px' : null));
  stickyZIndex = computed(() => (this.sticky() ? '2' : null));
}
