import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-icon',
  imports: [LucideAngularModule],
  styles: `
    app-icon lucide-icon svg {
      width: auto;
      height: 1em;
    }
    .pi {
      font-size: 1em;
      line-height: 1;
      width: 1em;
      height: 1em;
    }
  `,
  template: `
    @if (kind() === 'lucide') {
      <lucide-icon [name]="icon()"></lucide-icon>
    } @else {
      <i [class]="'pi pi-' + icon()"></i>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppIconComponent {
  kind = input<AppIconKind>();
  icon = input<LucideIconData | string>();
}

export type AppIconKind = 'lucide' | 'custom';
