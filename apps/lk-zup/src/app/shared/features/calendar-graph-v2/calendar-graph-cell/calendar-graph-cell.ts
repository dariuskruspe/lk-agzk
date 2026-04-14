import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import moment from 'moment';
import { BadgeAlertIcon, LucideAngularModule } from 'lucide-angular';
import { CalendarGraphCellPart } from '../types';
import { CalendarGraphHoverService } from '../shared/calendar-graph-hover.service';

@Component({
  selector: 'app-calendar-graph-cell',
  imports: [TooltipModule, NgClass, LucideAngularModule],
  templateUrl: './calendar-graph-cell.html',
  styleUrl: './calendar-graph-cell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarGraphCellComponent {
  private calendarGraphHoverService = inject(CalendarGraphHoverService);

  readonly icon = BadgeAlertIcon;
  readonly hoveredGroupId = this.calendarGraphHoverService.hoveredGroupId;

  parts = input<CalendarGraphCellPart[]>([]);

  partClick = output<CalendarGraphCellPart>();

  partsComputed = computed(() =>
    this.parts().map((part) => ({
      ...part,
      tooltip: this.getTooltip(part),
    })),
  );

  onPartMouseEnter(groupId: string): void {
    this.calendarGraphHoverService.hoveredGroupId.set(groupId);
  }

  onPartMouseLeave(): void {
    this.calendarGraphHoverService.hoveredGroupId.set(null);
  }

  private getTooltip(part: CalendarGraphCellPart): string {
    const startDate = moment(part.period.startDate).format('DD.MM.YYYY');
    const endDate = moment(part.period.endDate).format('DD.MM.YYYY');

    return `${startDate} - ${endDate}`;
  }
}
