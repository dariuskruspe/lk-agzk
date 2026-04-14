import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  ViewEncapsulation,
  viewChild,
} from '@angular/core';
import { AppCalendarMonthValue } from '@app/shared/components/app-calendar/app-calendar.component';
import { WindowService } from '@app/shared/services/window.service';
import { CalendarGraphMonthConfig } from './types';
import {
  GridComponent,
  GridBodyComponent,
  GridHeaderComponent,
  GridRowComponent,
  GridColComponent,
} from '../../grid';
import { NgComponentOutlet } from '@angular/common';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LucideAngularModule,
} from 'lucide-angular';
import { BindStickyClassDirective } from '@app/shared/directives/bind-sticky-class.directive';
import { CalendarGraphHoverService } from '../shared/calendar-graph-hover.service';

@Component({
  selector: 'app-calendar-graph-month',
  imports: [
    GridComponent,
    GridHeaderComponent,
    GridBodyComponent,
    GridRowComponent,
    GridColComponent,
    NgComponentOutlet,
    LucideAngularModule,
    BindStickyClassDirective,
  ],
  templateUrl: './calendar-graph-month.html',
  styleUrl: './calendar-graph-month.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [CalendarGraphHoverService],
})
export class CalendarGraphMonth {
  private window = inject(WindowService);
  private viewport = viewChild<ElementRef<HTMLDivElement>>('viewport');
  private viewportWidth = signal<number | null>(null);
  private visibleStartIndex = signal(0);

  readonly ChevronLeftIcon = ChevronLeftIcon;
  readonly ChevronRightIcon = ChevronRightIcon;
  readonly gridConfig = {
    className: 'timesheet-grid',
  };

  config = input.required<CalendarGraphMonthConfig>();

  month = input.required<AppCalendarMonthValue>();
  rows = input.required<unknown[]>();

  allDays = computed(() => {
    const [year, month] = this.month();
    const dayFormatter = new Intl.DateTimeFormat('ru-RU', {
      weekday: 'short',
    });
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = new Date(year, month, i + 1);
      const weekDay = dayFormatter.format(day).replace('.', '');
      const isWeekend = day.getDay() === 0 || day.getDay() === 6;

      return {
        day: i,
        name: i + 1 < 9 ? `0${i + 1}` : `${i + 1}`,
        weekDay: weekDay.slice(0, 1).toUpperCase() + weekDay.slice(1),
        isWeekend,
      };
    });
  });

  sideColumnsWidth = computed(
    () =>
      (this.config().targetCell?.cellRender.sizePx ?? 0) +
      (this.config().summaryCell?.cellRender.sizePx ?? 0),
  );

  visibleDayCount = computed(() => {
    const totalDays = this.allDays().length;
    const viewportWidth = this.viewportWidth();

    if (viewportWidth === null) {
      return totalDays;
    }

    const availableWidth = viewportWidth - this.sideColumnsWidth();
    const maxVisibleDays = Math.floor(
      availableWidth / this.config().minDayColWidth,
    );

    return Math.min(totalDays, Math.max(maxVisibleDays, 1));
  });

  maxVisibleStartIndex = computed(() =>
    Math.max(this.allDays().length - this.visibleDayCount(), 0),
  );

  visibleDays = computed(() => {
    const startIndex = Math.min(
      this.visibleStartIndex(),
      this.maxVisibleStartIndex(),
    );

    return this.allDays().slice(
      startIndex,
      startIndex + this.visibleDayCount(),
    );
  });

  hasHiddenDays = computed(
    () => this.visibleDayCount() < this.allDays().length,
  );

  headerSticky = computed(() => this.config().headerSticky);
  hasStickyHeader = computed(() => {
    const headerSticky = this.headerSticky();

    return headerSticky?.top != null || headerSticky?.bottom != null;
  });
  headerStickyTop = computed(() => this.headerSticky()?.top ?? null);
  headerStickyBottom = computed(() => this.headerSticky()?.bottom ?? null);

  canShowPreviousDays = computed(
    () => this.hasHiddenDays() && this.visibleStartIndex() > 0,
  );

  canShowNextDays = computed(
    () =>
      this.hasHiddenDays() &&
      this.visibleStartIndex() < this.maxVisibleStartIndex(),
  );

  rowsComputed = computed(() => {
    if (!this.rows()) return [];

    const config = this.config();
    const visibleDays = this.visibleDays();

    return this.rows().map((row) => ({
      row,
      cells: visibleDays.map((day) => ({
        day,
        render: config.dayCellRender(row, day),
      })),
    }));
  });

  constructor() {
    effect(() => {
      this.window.width();
      this.config();
      this.viewport();

      queueMicrotask(() => {
        this.measureViewportWidth();
      });
    });

    effect(() => {
      this.month();
      this.visibleStartIndex.set(0);
    });

    effect(() => {
      const currentStartIndex = this.visibleStartIndex();

      if (!this.hasHiddenDays()) {
        if (currentStartIndex !== 0) {
          this.visibleStartIndex.set(0);
        }
        return;
      }

      const maxVisibleStartIndex = this.maxVisibleStartIndex();

      if (currentStartIndex > maxVisibleStartIndex) {
        this.visibleStartIndex.set(maxVisibleStartIndex);
      }
    });
  }

  rowTrackBy = (row: unknown) => {
    return this.config().trackBy(row);
  };

  getColSize(sizePx?: number): string | undefined {
    return sizePx != null ? `${sizePx}px` : undefined;
  }

  showPreviousDays() {
    const step = this.visibleDayCount();

    this.visibleStartIndex.update((current) => Math.max(current - step, 0));
  }

  showNextDays() {
    const step = this.visibleDayCount();
    const maxVisibleStartIndex = this.maxVisibleStartIndex();

    this.visibleStartIndex.update((current) =>
      Math.min(current + step, maxVisibleStartIndex),
    );
  }

  private measureViewportWidth() {
    const viewport = this.viewport()?.nativeElement;

    if (!viewport) {
      return;
    }

    const nextWidth = Math.floor(viewport.getBoundingClientRect().width);

    this.viewportWidth.set(Number.isFinite(nextWidth) ? nextWidth : 0);
  }
}
