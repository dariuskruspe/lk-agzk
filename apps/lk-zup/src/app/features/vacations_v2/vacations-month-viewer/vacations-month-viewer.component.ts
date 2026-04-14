import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  CalendarGraphLegendComponent,
  CalendarGraphMonth,
} from '@app/shared/features/calendar-graph-v2';
import {
  CalendarGraphMonthConfig,
  CalendarGraphMonthDay,
} from '@app/shared/features/calendar-graph-v2/calendar-graph-month/types';
import { CalendarGraphMonthService } from '@app/shared/features/calendar-graph-v2/calendar-graph-month/calendar-graph-month.service';
import { BindStickyClassDirective } from '@app/shared/directives/bind-sticky-class.directive';
import {
  VacationItemComputed,
  VacationPeriodComputed,
  VacationsService,
} from '../shared/vacations.service';
import { VacationUtilsService } from '../shared/vacation-utils.service';
import { VacationsMonthViewerService } from './vacations-month-viewer.service';
import { VacationsMonthDayCell } from './vacations-month-day-cell/vacations-month-day-cell';
import { VacationsMonthEmployeeCell } from './vacations-month-employee-cell/vacations-month-employee-cell';
import { VacationMonthCell, VacationRowVm } from './types';
import moment, { Moment } from 'moment';

@Component({
  selector: 'app-vacations-month-viewer',
  imports: [
    CalendarGraphMonth,
    CalendarGraphLegendComponent,
    BindStickyClassDirective,
  ],
  templateUrl: './vacations-month-viewer.component.html',
  styleUrl: './vacations-month-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [CalendarGraphMonthService, VacationsMonthViewerService],
})
export class VacationsMonthViewerComponent {
  private vacationsService = inject(VacationsService);
  private utils = inject(VacationUtilsService);
  private viewerService = inject(VacationsMonthViewerService);

  employeeClick = output<VacationItemComputed>();

  loading = this.vacationsService.loading;
  statusTypes = this.vacationsService.vacationStatusTypes;
  statusTypesMap = this.vacationsService.statusTypesMap;

  month = computed<[number, number]>(() => {
    const [year, month] = this.vacationsService.fullMonth();
    return [year, month];
  });

  rows = computed<VacationRowVm[]>(() => {
    const [year, month] = this.vacationsService.fullMonth();
    const daysInMonth = moment([year, month, 1]).daysInMonth();

    return this.vacationsService.filteredVacations().map((vacation) => {
      const cells = new Array<VacationMonthCell | null>(daysInMonth).fill(null);

      for (const period of vacation.periods) {
        for (let i = 0; i < daysInMonth; i++) {
          const day = moment([year, month, i + 1]);
          if (this.isPeriodOverlap(period, day)) {
            cells[i] = this.createCell(vacation, period, day);
          }
        }
      }

      return {
        vacation,
        name: vacation.name,
        fullName: vacation.fullName || vacation.name,
        position: vacation.position || '',
        departmentName: vacation.departmentName,
        isCurrentUser: vacation.isCurrentUser,
        isManager: vacation.isManager,
        hasUnsignedPeriods:
          !!vacation.subordinated &&
          vacation.periods.some((p) => !p.approved && p.activeApprovement),
        cells,
      };
    });
  });

  calendarGraphMonthConfig = computed(
    () =>
      ({
        dayCellRender: (_row: unknown, _day: CalendarGraphMonthDay) => ({
          component: VacationsMonthDayCell,
          styleClass: 'vacation-day-cell',
        }),
        minDayColWidth: 28,
        trackBy: (row: VacationRowVm) => row.vacation.employeeId,
        headerSticky: {
          top: 'var(--main-top-offset, 16px)',
        },
        targetCell: {
          cellRender: {
            component: VacationsMonthEmployeeCell,
            sizePx: 150,
            styleClass: 'vacation-employee-col',
          },
          header: '',
        },
      }) satisfies CalendarGraphMonthConfig,
  );

  constructor() {
    this.viewerService.employeeClick$
      .pipe(takeUntilDestroyed())
      .subscribe((vacation) => this.employeeClick.emit(vacation));
  }

  private createCell(
    vacation: VacationItemComputed,
    period: VacationPeriodComputed,
    day: Moment,
  ): VacationMonthCell {
    const relevantOverlaps = vacation.overlaps.filter((overlap) => {
      const overlapStart = moment(overlap.startDate);
      const overlapEnd = moment(overlap.endDate);
      return day.isBetween(overlapStart, overlapEnd, 'day', '[]');
    });

    const hasIntersection = relevantOverlaps.length > 0;
    const intersectionTooltip = hasIntersection
      ? this.getIntersectionTooltip(relevantOverlaps, vacation.employeeId)
      : undefined;

    return {
      color: this.utils.getPeriodColor(this.statusTypesMap(), period),
      groupId: this.utils.getPeriodGroupId(vacation, period),
      period,
      vacation,
      hasIntersection,
      intersectionTooltip,
    };
  }

  private getIntersectionTooltip(
    overlaps: { employees: string[] }[],
    currentEmployeeId: string,
  ): string {
    const allEmployees = new Set<string>();
    overlaps.forEach((overlap) => {
      overlap.employees.forEach((id) => {
        if (id !== currentEmployeeId) {
          allEmployees.add(id);
        }
      });
    });

    const employeeNames: string[] = [];
    const vacations = this.vacationsService.vacations();
    allEmployees.forEach((employeeId) => {
      const employee = vacations.find((v) => v.employeeId === employeeId);
      if (employee) {
        employeeNames.push(employee.fullName || employee.name);
      }
    });

    if (employeeNames.length === 0) return '';

    return `Пересечение отпуска с ${employeeNames.join(', ')}`;
  }

  private isPeriodOverlap(period: VacationPeriodComputed, day: Moment) {
    return (
      period.startDateMoment.isSameOrBefore(day) &&
      period.endDateMoment.isSameOrAfter(day)
    );
  }
}
