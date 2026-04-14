import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  input,
  model,
  signal,
} from '@angular/core';
import { getMonthList } from '@app/shared/utils/datetime/common';
import { LucideAngularModule } from 'lucide-angular';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-angular';

@Component({
  selector: 'app-month-select',
  imports: [LucideAngularModule],
  templateUrl: './app-month-select.component.html',
  styleUrl: './app-month-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppMonthSelectComponent {
  lang = input<string>('ru');
  value = model<[number, number]>([
    new Date().getFullYear(),
    new Date().getMonth(),
  ]);

  isOpen = signal(false);
  dropdownPosition = signal<'top' | 'center' | 'bottom'>('center');

  ChevronLeftIcon = ChevronLeftIcon;
  ChevronRightIcon = ChevronRightIcon;

  monthNames = computed(() => {
    return getMonthList(this.lang(), 'long');
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
    const dropdownHeight = 360; // высота раскрытого дропдауна
    const currentMonthIndex = this.value()[1];
    const itemHeight = 30;
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;

    // Рассчитываем необходимое пространство сверху и снизу для центрированного положения
    const spaceNeededAbove = (currentMonthIndex * itemHeight) + (itemHeight / 2);
    const spaceNeededBelow = ((11 - currentMonthIndex) * itemHeight) + (itemHeight / 2);

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

  selectMonth(monthIndex: number, event: Event) {
    event.stopPropagation();
    const [year] = this.value();
    this.value.set([year, monthIndex]);
    this.isOpen.set(false);
  }

  onIncreaseMonth() {
    let [year, month] = this.value();
    if (month === 11) {
      year++;
      month = 0;
    } else {
      month++;
    }
    this.value.set([year, month]);
    this.isOpen.set(false);
  }

  onDecreaseMonth() {
    let [year, month] = this.value();
    if (month === 0) {
      year--;
      month = 11;
    } else {
      month--;
    }
    this.value.set([year, month]);
    this.isOpen.set(false);
  }
}
