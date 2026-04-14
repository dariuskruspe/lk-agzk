import {
  CalendarGraphLegendComponent,
  CalendarGraphLegendVariant,
  CalendarGraphMonth,
} from '@app/shared/features/calendar-graph-v2';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import {
  CalendarGraphMonthConfig,
  CalendarGraphMonthDay,
} from '@app/shared/features/calendar-graph-v2/calendar-graph-month/types';
import {
  BusinessTripItemComputed,
  BusinessTripPeriodComputed,
  BusinessTripService,
} from '../shared/business-trip.service';
import moment, { Moment } from 'moment';
import { VacationUtilsService } from '@app/features/vacations_v2/shared/vacation-utils.service';
import { SettingsFacade } from '@app/shared/features/settings/facades/settings.facade';
import { BindStickyClassDirective } from '@app/shared/directives/bind-sticky-class.directive';
import { BusinessTripMonthDayCell } from './business-trip-month-day-cell/business-trip-month-day-cell';
import { BusinessTripMonthEmployeeCell } from './business-trip-month-employee-cell/business-trip-month-employee-cell';
import { BusinessTripMonthCell, BusinessTripRowVm } from './types';

interface LegendItem {
  name: string;
  color: string;
  variant: CalendarGraphLegendVariant;
}

@Component({
  selector: 'app-business-trip-month-viewer',
  imports: [
    CalendarGraphMonth,
    CalendarGraphLegendComponent,
    BindStickyClassDirective,
  ],
  templateUrl: './business-trip-month-viewer.component.html',
  styleUrl: './business-trip-month-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessTripMonthViewerComponent {
  private businessTripService = inject(BusinessTripService);
  private utils = inject(VacationUtilsService);
  private settingsFacade = inject(SettingsFacade);

  statusTypes = this.businessTripService.tripStatusTypes;
  statusTypesMap = this.businessTripService.statusTypesMap;
  loading = this.businessTripService.loading;

  legendItems = computed<LegendItem[]>(() => {
    const types = this.statusTypes();
    if (!types.length) {
      return [];
    }

    const baseType = types[0];
    const settings = this.settingsFacade.getData();
    const items: LegendItem[] = [];

    if (settings?.businessTrips?.expenseReportsEnable) {
      items.push({
        name: 'Командировка (С Авансовым отчетом)',
        color: 'var(--done)',
        variant: 'withReport',
      });
    }

    items.push({
      name: 'Командировка',
      color: baseType.color,
      variant: 'default',
    });

    items.push({
      name: 'Командировка на согласовании',
      color: baseType.color,
      variant: 'approving',
    });

    items.push({
      name: 'Командировка отменена',
      color: baseType.color,
      variant: 'cancelled',
    });

    return items;
  });

  month = computed<[number, number]>(() => {
    const [year, month] = this.businessTripService.fullMonth();
    return [year, month];
  });

  rows = computed<BusinessTripRowVm[]>(() => {
    const [year, month] = this.businessTripService.fullMonth();
    const daysInMonth = moment([year, month, 1]).daysInMonth();

    return this.businessTripService.filteredTrips().map((trip) => {
      const cells = new Array<BusinessTripMonthCell | null>(daysInMonth).fill(
        null,
      );

      for (const period of trip.periods) {
        for (let i = 0; i < daysInMonth; i++) {
          const day = moment([year, month, i + 1]);
          if (this.isPeriodOverlap(period, day)) {
            cells[i] = this.createCell(trip, period, day);
          }
        }
      }

      return {
        trip,
        name: trip.name,
        fullName: trip.fullName || trip.name,
        position: trip.position || '',
        departmentName: trip.departmentName,
        isCurrentUser: trip.isCurrentUser,
        cells,
      };
    });
  });

  calendarGraphMonthConfig = computed(
    () =>
      ({
        dayCellRender: (_row: unknown, _day: CalendarGraphMonthDay) => ({
          component: BusinessTripMonthDayCell,
          styleClass: 'business-trip-day-cell',
        }),
        minDayColWidth: 28,
        trackBy: (row: BusinessTripRowVm) => row.trip.employeeId,
        headerSticky: {
          top: 'var(--main-top-offset, 16px)',
        },
        targetCell: {
          cellRender: {
            component: BusinessTripMonthEmployeeCell,
            sizePx: 150,
            styleClass: 'business-trip-employee-col',
          },
          header: '',
        },
      }) satisfies CalendarGraphMonthConfig,
  );

  private createCell(
    trip: BusinessTripItemComputed,
    period: BusinessTripPeriodComputed,
    day: Moment,
  ): BusinessTripMonthCell {
    const relevantOverlaps = trip.overlaps.filter((overlap) => {
      const overlapStart = moment(overlap.startDate);
      const overlapEnd = moment(overlap.endDate);
      return day.isBetween(overlapStart, overlapEnd, 'day', '[]');
    });

    const hasIntersection = relevantOverlaps.length > 0;
    const intersectionTooltip = hasIntersection
      ? this.getIntersectionTooltip(relevantOverlaps, trip.employeeId)
      : undefined;

    return {
      color: this.getCellColor(period),
      groupId: this.utils.getPeriodGroupId(trip, period),
      period,
      vacation: trip,
      hasIntersection,
      intersectionTooltip,
      variant: this.getCellVariant(period),
    };
  }

  private getCellVariant(
    period: BusinessTripPeriodComputed,
  ): CalendarGraphLegendVariant {
    if (period.status === 'onApproval') {
      return 'approving';
    }
    if (period.status === 'cancelled') {
      return 'cancelled';
    }
    if (period.linkedIssueId) {
      return 'withReport';
    }
    return 'default';
  }

  private getCellColor(period: BusinessTripPeriodComputed): string {
    if (
      period.linkedIssueId &&
      period.status !== 'onApproval' &&
      period.status !== 'cancelled'
    ) {
      return 'var(--done)';
    }

    return this.utils.getPeriodColor(this.statusTypesMap(), period);
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
    const trips = this.businessTripService.trips();
    allEmployees.forEach((employeeId) => {
      const employee = trips.find((t) => t.employeeId === employeeId);
      if (employee) {
        employeeNames.push(employee.fullName || employee.name);
      }
    });

    if (employeeNames.length === 0) {
      return '';
    }

    return `Пересечение командировки с ${employeeNames.join(', ')}`;
  }

  private isPeriodOverlap(period: BusinessTripPeriodComputed, day: Moment) {
    return (
      period.startDateMoment.isSameOrBefore(day) &&
      period.endDateMoment.isSameOrAfter(day)
    );
  }
}
