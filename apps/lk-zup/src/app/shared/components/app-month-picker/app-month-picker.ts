import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  signal,
  viewChild,
  contentChild,
} from '@angular/core';
import { getMonthList } from '@app/shared/utils/datetime/common';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LucideAngularModule,
} from 'lucide-angular';
import { OverlayModule } from '@angular/cdk/overlay';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-month-picker',
  imports: [LucideAngularModule, OverlayModule, NgTemplateOutlet],
  templateUrl: './app-month-picker.html',
  styleUrl: './app-month-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppMonthPicker {
  private localStorageService = inject(LocalStorageService);

  value = model<AppMonthPickerValue>([
    new Date().getFullYear(),
    new Date().getMonth(),
  ]);

  min = input<AppMonthPickerValue | null>(null);
  max = input<AppMonthPickerValue | null>(null);
  showTrigger = input<boolean>(true);
  dateFormat = input<string>('MM yy');

  lang = computed(() => {
    return this.localStorageService.getCurrentLang() || 'ru';
  });

  isOpen = signal(false);
  displayedYear = signal<number>(new Date().getFullYear());
  triggerElement = viewChild<ElementRef>('trigger');

  overlayOrigin = computed(() => {
    return this.showTrigger() ? this.triggerElement() : this.elementRef;
  });

  ChevronLeftIcon = ChevronLeftIcon;
  ChevronRightIcon = ChevronRightIcon;

  monthNames = computed(() => {
    return getMonthList(this.lang(), 'long');
  });

  displayValue = computed(() => {
    const [year, month] = this.value();
    const monthName = this.monthNames()[month];
    return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
  });

  displayedYearValue = computed(() => {
    return this.displayedYear();
  });

  canDecreaseYear = computed(() => {
    const min = this.min();
    if (!min) return true;
    return this.displayedYear() > min[0];
  });

  canIncreaseYear = computed(() => {
    const max = this.max();
    if (!max) return true;
    return this.displayedYear() < max[0];
  });

  isMonthDisabled = computed(() => {
    const min = this.min();
    const max = this.max();
    const year = this.displayedYear();

    return (monthIndex: number): boolean => {
      if (min && (year < min[0] || (year === min[0] && monthIndex < min[1]))) {
        return true;
      }
      if (max && (year > max[0] || (year === max[0] && monthIndex > max[1]))) {
        return true;
      }
      return false;
    };
  });

  isMonthSelected = computed(() => {
    const [selectedYear, selectedMonth] = this.value();
    const year = this.displayedYear();

    return (monthIndex: number): boolean => {
      return selectedYear === year && selectedMonth === monthIndex;
    };
  });

  templateTrigger = contentChild<TemplateRef<any>>('trigger');

  constructor(public elementRef: ElementRef) {}

  toggle() {
    if (!this.isOpen()) {
      this.syncDisplayedYear();
    }
    this.isOpen.set(!this.isOpen());
  }

  private syncDisplayedYear() {
    const [year] = this.value();
    this.displayedYear.set(year);
  }

  onOverlayDetach() {
    this.isOpen.set(false);
  }

  onDecreaseYear() {
    if (this.canDecreaseYear()) {
      this.displayedYear.update((year) => year - 1);
    }
  }

  onIncreaseYear() {
    if (this.canIncreaseYear()) {
      this.displayedYear.update((year) => year + 1);
    }
  }

  selectMonth(monthIndex: number, event: Event) {
    event.stopPropagation();
    if (this.isMonthDisabled()(monthIndex)) {
      return;
    }
    this.value.set([this.displayedYear(), monthIndex]);
    this.isOpen.set(false);
  }
}

// год/месяц
export type AppMonthPickerValue = [number, number];
