import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  computed,
  signal,
  TemplateRef,
  ElementRef,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule, CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
  LucideAngularModule,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-angular';
import { isWeekend, sameDate } from '@app/shared/utils/datetime/common';
import { keyBy, cloneDeep } from 'lodash';
import moment from 'moment';

/**
 * Значение месяца календаря [год, месяц]
 * Месяц индексируется с 0 (январь = 0, декабрь = 11)
 */
export type AppCalendarMonthValue = [number, number];

/**
 * Стили отображения выделенных дней в календаре
 */
export type AppCalendarSelectionStyleType =
  | 'none'
  | 'text'
  | 'filled' // Заполненный фон
  | 'outlined'; // Только обводка

export type AppCalendarStyle = {
  type: AppCalendarSelectionStyleType;
  text?: string;
  fill?: string | boolean;
  border?: string | boolean;
};

/**
 * Выделение отдельного дня
 */
export type AppCalendarInputDay = {
  date: Date;
  tooltip: string;
  groupId?: string;
  style: AppCalendarStyle;
};

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, OverlayModule, LucideAngularModule],
  templateUrl: './app-calendar.component.html',
  styleUrl: './app-calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppCalendarComponent {
  // ==================== КОНСТАНТЫ ====================

  private static readonly DAYS_IN_WEEK = 7;
  private static readonly CALENDAR_WEEKS = 6;
  private static readonly TOTAL_CALENDAR_SLOTS =
    AppCalendarComponent.DAYS_IN_WEEK * AppCalendarComponent.CALENDAR_WEEKS;

  // ==================== ВХОДНЫЕ ПАРАМЕТРЫ ====================

  /** Текущий отображаемый месяц [год, месяц] */
  month = input<AppCalendarMonthValue>([
    new Date().getFullYear(),
    new Date().getMonth(),
  ]);

  defaultStyle = input<AppCalendarStyle>({
    type: 'filled',
    text: '',
    fill: false,
    border: false,
  });

  days = input<AppCalendarInputDay[]>([]);

  /** Кастомный шаблон для тултипов */
  tooltipTemplate = input<TemplateRef<unknown>>();

  loading = input<boolean>(false);

  // ==================== СОБЫТИЯ ====================

  /** Событие изменения месяца */
  monthChange = output<AppCalendarMonthValue>();

  calendarDays = computed(() => {
    const [year, month] = this.month();
    const days = cloneDeep(this.days());

    const daysMap = keyBy(days, (d) => moment(d.date).format('YYYY-MM-DD'));

    const firstDayOfMonth = moment([year, month, 1]).startOf('day');
    const gridStartDate = firstDayOfMonth
      .clone()
      .set({ weekday: 0 })
      .startOf('day');

    return Array.from(
      { length: AppCalendarComponent.TOTAL_CALENDAR_SLOTS },
      (_, index) => {
        const day = gridStartDate.clone().add(index, 'days').startOf('day');
        const dayId = day.format('YYYY-MM-DD');

        let dayInfo = daysMap[dayId];

        if (!dayInfo) {
          dayInfo = {
            date: day.toDate(),
            tooltip: '',
            style: {
              ...this.defaultStyle(),
            },
          };
        }

        const isCurrentMonth = day.isSame(firstDayOfMonth, 'month');

        // если не текущий месяц, то текст серого цвета
        if (!isCurrentMonth) {
          dayInfo.style = {
            type: 'none',
          };
        }

        return {
          ...dayInfo,
          id: dayId,
        };
      },
    );
  });

  tooltipOriginElement = signal<ElementRef<HTMLElement> | null>(null);
  hoveredDay = signal<AppCalendarInputDay | null>(null);

  constructor() {
    effect(() => {
      console.log('calendarDays', this.calendarDays());
    });
  }

  // ==================== ЛОКАЛИЗАЦИЯ ====================
  // TODO: добавить поддержку i18n

  /** Названия дней недели */
  readonly weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  /** Названия месяцев */
  private readonly monthNames = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];

  // ==================== ВЫЧИСЛЯЕМЫЕ СВОЙСТВА ====================

  /** Отформатированное название месяца */
  monthName = computed(() => {
    const [year, month] = this.month();
    return `${this.monthNames[month]} ${year}`;
  });

  // ==================== ИКОНКИ ====================

  readonly ChevronLeftIcon = ChevronLeftIcon;
  readonly ChevronRightIcon = ChevronRightIcon;

  onMouseEnter(event: MouseEvent, day: AppCalendarInputDay): void {
    console.log('onMouseMove', event);
    const target = event.target as HTMLElement;
    this.tooltipOriginElement.set(new ElementRef(target));
    this.hoveredDay.set(day);
  }

  previousMonth(): void {
    this.shiftMonth(-1);
  }

  nextMonth(): void {
    this.shiftMonth(1);
  }

  /**
   * Сдвинуть текущий месяц на указанное количество месяцев
   * @param offset Положительное число для будущих месяцев, отрицательное для прошлых
   */
  private shiftMonth(offset: number): void {
    let [year, month] = this.month();
    month += offset;
    if (month < 0) {
      year--;
      month = 11;
    } else if (month > 11) {
      year++;
      month = 0;
    }
    const target = new Date(year, month, 1);
    this.monthChange.emit([target.getFullYear(), target.getMonth()]);
  }
}
