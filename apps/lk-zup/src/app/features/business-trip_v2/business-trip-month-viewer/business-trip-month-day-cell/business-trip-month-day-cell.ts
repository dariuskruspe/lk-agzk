import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import {
  CalendarGraphMonthCellComponent,
  CalendarGraphMonthDay,
  ICalendarCellInputs,
} from '@app/shared/features/calendar-graph-v2';
import { BusinessTripInfoService } from '../../shared/business-trip-info.service';
import { BusinessTripRowVm } from '../types';

@Component({
  selector: 'app-business-trip-month-day-cell',
  imports: [CalendarGraphMonthCellComponent],
  templateUrl: './business-trip-month-day-cell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessTripMonthDayCell
  implements ICalendarCellInputs<BusinessTripRowVm>
{
  private businessTripInfoService = inject(BusinessTripInfoService);

  row = input<BusinessTripRowVm>();
  day = input<CalendarGraphMonthDay>();

  cell = computed(() => {
    const row = this.row();
    const day = this.day();
    if (!row || day == null) return null;
    return row.cells[day.day] ?? null;
  });

  onCellClick(event: Event): void {
    const cell = this.cell();
    if (cell) {
      this.businessTripInfoService.showPeriodInfo(
        event,
        cell.vacation,
        cell.period,
      );
    }
  }
}
