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
  effect,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { PrimeNGConfig } from 'primeng/api';
import {
  CALENDER_CONFIG_EN,
  CALENDER_CONFIG_RU,
} from '@app/shared/dictionaries/calendar-locale.dictionary';
import { LucideAngularModule } from 'lucide-angular';
import { OverlayModule } from '@angular/cdk/overlay';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import moment from 'moment';

const locale = {
  en: CALENDER_CONFIG_EN,
  ru: CALENDER_CONFIG_RU,
};

@Component({
  selector: 'app-date-picker',
  imports: [
    LucideAngularModule,
    OverlayModule,
    NgTemplateOutlet,
    CalendarModule,
    FormsModule,
  ],
  templateUrl: './app-date-picker.html',
  styleUrl: './app-date-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDatePicker implements OnInit {
  private localStorageService = inject(LocalStorageService);
  private config = inject(PrimeNGConfig);

  value = model<Date | null>(new Date());

  min = input<Date | null>(null);
  max = input<Date | null>(null);
  showTrigger = input<boolean>(true);
  dateFormat = input<string>('DD.MM.YYYY');
  firstDayOfWeek = input<number>(1);

  lang = computed(() => {
    return this.localStorageService.getCurrentLang() || 'ru';
  });

  isOpen = signal(false);
  triggerElement = viewChild<ElementRef>('trigger');

  overlayOrigin = computed(() => {
    return this.showTrigger() ? this.triggerElement() : this.elementRef;
  });

  displayValue = computed(() => {
    const date = this.value();
    if (!date) return '';
    return moment(date).format(this.dateFormat());
  });

  templateTrigger = contentChild<TemplateRef<any>>('trigger');

  // Для работы с ngModel нужна обычная переменная
  get selectedDate(): Date | null {
    return this.value();
  }

  set selectedDate(value: Date | null) {
    this.value.set(value);
  }

  constructor(public elementRef: ElementRef) {
    effect(() => {
      const lang = this.lang();
      this.config.setTranslation(locale[lang]);
    });
  }

  ngOnInit() {
    const lang = this.lang();
    this.config.setTranslation(locale[lang]);
  }

  toggle() {
    this.isOpen.set(!this.isOpen());
  }

  onOverlayDetach() {
    this.isOpen.set(false);
  }

  onDateSelect() {
    // Дата уже обновлена через ngModel
    this.isOpen.set(false);
  }
}
