import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { AppIconComponent } from '@app/shared/components/app-icon/app-icon.component';
import {
  CalendarGraphMonthDay,
  ICalendarCellInputs,
} from '@app/shared/features/calendar-graph-v2';
import { DialogService } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';
import { TimesheetScheduleDayType } from '@app/shared/features/timesheet-schedule';
import { TimesheetRowVm } from '../types';
import { sortTimesheetDayTypes } from '../day-type-sort';
import { TimesheetDayDetailsDialogComponent } from '../timesheet-day-details-dialog/timesheet-day-details-dialog.component';

@Component({
  selector: 'app-timesheet-day-cell',
  imports: [AppIconComponent, TooltipModule],
  templateUrl: './timesheet-day-cell.html',
  styleUrl: './timesheet-day-cell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetDayCell implements ICalendarCellInputs<TimesheetRowVm> {
  private dialogService = inject(DialogService);

  row = input<TimesheetRowVm>();
  day = input<CalendarGraphMonthDay>();

  dayVm = computed(() => {
    return this.row().days[this.day().day];
  });

  tooltipText = computed(() => {
    const d = this.dayVm();
    return sortTimesheetDayTypes(d.dayTypes)
      .map((item) => this.formatTooltipLine(item))
      .join('<br>');
  });

  onCellClick(): void {
    const row = this.row();
    const dayVm = this.dayVm();

    if (!row || !dayVm) {
      return;
    }

    this.dialogService.open(TimesheetDayDetailsDialogComponent, {
      width: '640px',
      data: {
        employeeName: row.employeeDisplayName,
        date: dayVm.date,
        hoursPlan: dayVm.hours,
        hoursFact: dayVm.hoursFact,
        dayTypes: sortTimesheetDayTypes(dayVm.dayTypes),
        canOpenIssue: row.canOpenIssue,
      },
      closable: true,
      dismissableMask: true,
    });
  }

  onCellKeydown(event: KeyboardEvent): void {
    event.preventDefault();
    this.onCellClick();
  }

  private formatTooltipLine(dayType: TimesheetScheduleDayType): string {
    const plan = dayType.hoursCountPlan;
    const fact = dayType.hoursCountActual;

    if (plan > 0 && fact > 0) {
      if (plan === fact) {
        return `${dayType.name} - ${this.formatHours(plan)}`;
      }

      return `${dayType.name} - ${this.formatHours(plan)} план, ${this.formatHours(fact)} факт`;
    }

    if (plan > 0) {
      return `${dayType.name} - ${this.formatHours(plan)} план`;
    }

    if (fact > 0) {
      return `${dayType.name} - ${this.formatHours(fact)} факт`;
    }

    return dayType.name;
  }

  private formatHours(value: number): string {
    return `${value} ч.`;
  }
}
