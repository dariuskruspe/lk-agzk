import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { LucideAngularModule, XIcon } from 'lucide-angular';

@Component({
  selector: 'app-app-filter-chip',
  imports: [LucideAngularModule],
  templateUrl: './app-filter-chip.component.html',
  styleUrl: './app-filter-chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppFilterChipComponent {
  remove = output<void>();

  XIcon = XIcon;

  onRemove() {
    this.remove.emit();
  }
}
