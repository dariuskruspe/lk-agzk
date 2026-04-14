import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { TimesheetRowVm } from '../types';
import { ICalendarCellSummaryInputs } from '@app/shared/features/calendar-graph-v2';

@Component({
  selector: 'app-timesheet-summary-cell',
  imports: [],
  templateUrl: './timesheet-summary-cell.html',
  styleUrl: './timesheet-summary-cell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetSummaryCell implements ICalendarCellSummaryInputs<TimesheetRowVm> {
  row = input<TimesheetRowVm>();

  summaryHours = computed(() => {
    return this.row().summaryHours;
  });

  summaryHoursFact = computed(() => {
    return this.row().summaryHoursFact;
  });
}
