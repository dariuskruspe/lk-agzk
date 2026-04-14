import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  model,
  signal,
} from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-angular';

@Component({
  selector: 'app-year-select',
  imports: [LucideAngularModule],
  templateUrl: './app-year-select.component.html',
  styleUrl: './app-year-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppYearSelectComponent {
  value = model<number>(new Date().getFullYear());

  isOpen = signal(false);
  dropdownPosition = signal<'top' | 'center' | 'bottom'>('center');

  ChevronLeftIcon = ChevronLeftIcon;
  ChevronRightIcon = ChevronRightIcon;

  // Генерируем список годов: -3 от текущего до +3 от текущего
  years = computed(() => {
    const currentYear = this.value();
    const yearsList: number[] = [];
    for (let i = -3; i <= 3; i++) {
      yearsList.push(currentYear + i);
    }
    return yearsList;
  });

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  constructor(private elementRef: ElementRef) {}

  toggleDropdown() {
    if (!this.isOpen()) {
      this.calculateDropdownPosition();
    }
    this.isOpen.set(!this.isOpen());
  }

  private calculateDropdownPosition() {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const dropdownHeight = 210; // высота раскрытого дропдауна (7 элементов * 30px)
    const currentYearIndex = 3; // текущий год всегда в центре (индекс 3 из 7)
    const itemHeight = 30;
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;

    // Рассчитываем необходимое пространство сверху и снизу для центрированного положения
    const spaceNeededAbove = (currentYearIndex * itemHeight) + (itemHeight / 2);
    const spaceNeededBelow = ((6 - currentYearIndex) * itemHeight) + (itemHeight / 2);

    if (spaceAbove < spaceNeededAbove) {
      // Недостаточно места сверху - прижимаем к верху
      this.dropdownPosition.set('top');
    } else if (spaceBelow < spaceNeededBelow) {
      // Недостаточно места снизу - прижимаем к низу
      this.dropdownPosition.set('bottom');
    } else {
      // Достаточно места с обеих сторон - центрируем
      this.dropdownPosition.set('center');
    }
  }

  selectYear(year: number, event: Event) {
    event.stopPropagation();
    this.value.set(year);
    this.isOpen.set(false);
  }

  onIncreaseYear() {
    this.value.set(this.value() + 1);
    this.isOpen.set(false);
  }

  onDecreaseYear() {
    this.value.set(this.value() - 1);
    this.isOpen.set(false);
  }
}
