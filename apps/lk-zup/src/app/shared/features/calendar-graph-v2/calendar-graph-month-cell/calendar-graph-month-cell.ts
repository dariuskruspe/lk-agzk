import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import moment from 'moment';
import {
  BadgeAlertIcon,
  LucideAngularModule,
} from 'lucide-angular';
import { CalendarGraphMonthCell } from '../types';
import { CalendarGraphHoverService } from '../shared/calendar-graph-hover.service';

@Component({
  selector: 'app-calendar-graph-month-cell',
  imports: [TooltipModule, NgClass, LucideAngularModule],
  templateUrl: './calendar-graph-month-cell.html',
  styleUrl: './calendar-graph-month-cell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarGraphMonthCellComponent {
  private calendarGraphHoverService = inject(CalendarGraphHoverService);

  readonly icon = BadgeAlertIcon;
  readonly hoveredGroupId = this.calendarGraphHoverService.hoveredGroupId;

  cell = input<CalendarGraphMonthCell | null>();

  tooltip = computed(() => {
    const cell = this.cell();
    if (!cell) {
      return '';
    }

    return `${moment(cell.period.startDate).format('DD.MM.YYYY')} - ${moment(cell.period.endDate).format('DD.MM.YYYY')}`;
  });

  onMouseEnter(): void {
    const groupId = this.cell()?.groupId;

    if (groupId) {
      this.calendarGraphHoverService.hoveredGroupId.set(groupId);
    }
  }

  onMouseLeave(): void {
    this.calendarGraphHoverService.hoveredGroupId.set(null);
  }
}
