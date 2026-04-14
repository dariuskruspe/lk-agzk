import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// Интерфейс для группы настроек
export interface SettingsGroup {
  key: string;
  title: string;
  icon: string;
  description?: string;
}

@Component({
    selector: 'app-settings-group',
    imports: [CommonModule],
    templateUrl: './settings-group.component.html',
    styleUrl: './settings-group.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsGroupComponent {
  group = input.required<SettingsGroup>();
  hasChanges = input<boolean>(false);
  expandedByDefault = input<boolean>(true);

  // Внутреннее состояние раскрытия
  private internalExpanded = signal<boolean>(true);

  // Вычисляемое свойство для состояния раскрытия
  isExpanded = computed(() => {
    // При первой инициализации используем значение expandedByDefault
    if (this.internalExpanded() === null) {
      return this.expandedByDefault();
    }
    return this.internalExpanded();
  });

  constructor() {
    // Инициализируем состояние на основе входного параметра
    this.internalExpanded.set(this.expandedByDefault());
  }

  toggleExpanded() {
    this.internalExpanded.update((current) => !current);
  }
}
