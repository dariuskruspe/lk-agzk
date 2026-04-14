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
import { VacationInfoService } from '../../shared/vacation-info.service';
import { VacationRowVm } from '../types';

@Component({
  selector: 'app-vacations-month-day-cell',
  imports: [CalendarGraphMonthCellComponent],
  templateUrl: './vacations-month-day-cell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VacationsMonthDayCell implements ICalendarCellInputs<VacationRowVm> {
  private vacationInfoService = inject(VacationInfoService);

  row = input<VacationRowVm>();
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
      this.vacationInfoService.showPeriodInfo(event, cell.vacation, cell.period);
    }
  }
}
