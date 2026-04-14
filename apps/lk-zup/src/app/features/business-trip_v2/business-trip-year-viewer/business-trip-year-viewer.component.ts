import {
  CalendarGraph,
  CalendarGraphCellComponent,
  CalendarGraphCellPart,
  CalendarGraphEmployeeNameCellComponent,
  CalendarGraphEmployeeNameCellData,
  CalendarGraphLegendComponent,
  CalendarGraphLegendVariant,
} from '@app/shared/features/calendar-graph-v2';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  GridBodyComponent,
  GridColComponent,
  GridComponent,
  GridHeaderComponent,
  GridRowComponent,
} from '@app/shared/features/grid';
import {
  BusinessTripItemComputed,
  BusinessTripService,
} from '../shared/business-trip.service';
import { VacationPeriodInterface } from '@app/features/vacations/models/vacations.interface';
import { LangFacade } from '@app/shared/features/lang/facades/lang.facade';
import { getMonthList } from '@app/shared/utils/datetime/common';
import { VacationUtilsService } from '@app/features/vacations_v2/shared/vacation-utils.service';
import { SettingsFacade } from '@app/shared/features/settings/facades/settings.facade';

interface GridRowData {
  employeeId: string;
  employee: CalendarGraphEmployeeNameCellData;
  rows: {
    cells: GridCellData[];
  }[];
}

interface GridCellData {
  parts: CalendarGraphCellPart[];
}

interface LegendItem {
  name: string;
  color: string;
  variant: CalendarGraphLegendVariant;
}

@Component({
  selector: 'app-business-trip-year-viewer',
  imports: [
    GridComponent,
    GridHeaderComponent,
    GridRowComponent,
    GridColComponent,
    GridBodyComponent,
    CalendarGraph,
    CalendarGraphCellComponent,
    CalendarGraphEmployeeNameCellComponent,
    CalendarGraphLegendComponent,
  ],
  templateUrl: './business-trip-year-viewer.component.html',
  styleUrl: './business-trip-year-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BusinessTripYearViewerComponent {
  private langFacade = inject(LangFacade);
  private businessTripService = inject(BusinessTripService);
  private utils = inject(VacationUtilsService);
  private settingsFacade = inject(SettingsFacade);

  trips = this.businessTripService.filteredTrips;
  statusTypes = this.businessTripService.tripStatusTypes;
  loading = this.businessTripService.loading;
  viewType = this.businessTripService.viewType;
  year = this.businessTripService.year;
  lang = this.langFacade.langSignal;

  header = signal(
    getMonthList(this.lang(), 'long').map((name) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
    })),
  );

  value = computed(() => this.mapTripsToGridData(this.trips()));

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

  private mapTripsToGridData(trips: BusinessTripItemComputed[]): GridRowData[] {
    return trips.map((employee) => ({
      employeeId: employee.employeeId,
      employee: {
        name: employee.name,
        fullName: employee.fullName || employee.name,
        position: employee.position || '',
        departmentName: employee.departmentName,
        isCurrentUser: employee.isCurrentUser,
        clickable: false,
      },
      rows: [
        {
          cells: this.createYearCells(employee),
        },
      ],
    }));
  }

  private createYearCells(employee: BusinessTripItemComputed): GridCellData[] {
    const cells: GridCellData[] = [];

    for (let month = 0; month < 12; month++) {
      const monthParts = this.getMonthParts(employee, month);
      cells.push({ parts: monthParts });
    }

    return cells;
  }

  private getMonthParts(
    employee: BusinessTripItemComputed,
    month: number,
  ): CalendarGraphCellPart[] {
    const parts: CalendarGraphCellPart[] = [];
    const year = this.businessTripService.year();

    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    for (const period of employee.periods) {
      const startDate = period.startDateMoment.toDate();
      const endDate = period.endDateMoment.toDate();

      if (this.periodsOverlap(startDate, endDate, monthStart, monthEnd)) {
        const part = this.createCalendarPart(
          employee,
          period,
          startDate,
          endDate,
          monthStart,
          monthEnd,
        );
        if (part) {
          parts.push(part);
        }
      }
    }

    parts.sort((a, b) => a.start - b.start);

    return this.addGapsBetweenParts(parts);
  }

  private periodsOverlap(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date,
  ): boolean {
    return start1 <= end2 && end1 >= start2;
  }

  private addGapsBetweenParts(
    parts: CalendarGraphCellPart[],
  ): CalendarGraphCellPart[] {
    if (parts.length <= 1) return parts;

    const GAP_SIZE = 1;
    const result: CalendarGraphCellPart[] = parts;

    for (let i = 0; i < parts.length; i++) {
      const currentPart = { ...parts[i] };

      if (i < parts.length - 1) {
        const nextPart = parts[i + 1];
        const currentEnd = currentPart.start + currentPart.size;

        if (nextPart.start <= currentEnd + GAP_SIZE) {
          currentPart.size = Math.max(
            0,
            nextPart.start - currentPart.start - GAP_SIZE,
          );
        }
      }

      if (i > 0) {
        const prevPart = result[result.length - 1];
        const prevEnd = prevPart.start + prevPart.size;

        if (currentPart.start < prevEnd + GAP_SIZE) {
          const shift = prevEnd + GAP_SIZE - currentPart.start;
          currentPart.start += shift;
          currentPart.size = Math.max(0, currentPart.size - shift);
        }
      }

      if (currentPart.size > 0) {
        result.push(currentPart);
      }
    }

    return result;
  }

  private createCalendarPart(
    employee: BusinessTripItemComputed,
    period: VacationPeriodInterface,
    periodStart: Date,
    periodEnd: Date,
    monthStart: Date,
    monthEnd: Date,
  ): CalendarGraphCellPart | null {
    const overlapStart = new Date(
      Math.max(periodStart.getTime(), monthStart.getTime()),
    );
    const overlapEnd = new Date(
      Math.min(periodEnd.getTime(), monthEnd.getTime()),
    );

    if (overlapStart > overlapEnd) return null;

    const daysInMonth = monthEnd.getDate();
    const startDay = overlapStart.getDate();
    const endDay = overlapEnd.getDate();

    const start = ((startDay - 1) / daysInMonth) * 100;
    const size = ((endDay - startDay + 1) / daysInMonth) * 100;

    const color = this.getCellColor(period);
    const variant = this.getCellVariant(period);

    const relevantOverlaps = employee.overlaps.filter((overlap) => {
      const overlapStartDate = new Date(overlap.startDate).getTime();
      const overlapEndDate = new Date(overlap.endDate).getTime();
      const periodStartTime = periodStart.getTime();
      const periodEndTime = periodEnd.getTime();
      return (
        overlapStartDate <= periodEndTime && overlapEndDate >= periodStartTime
      );
    });

    const hasIntersection = relevantOverlaps.length > 0;
    const intersectionTooltip = hasIntersection
      ? this.getIntersectionTooltip(relevantOverlaps, employee.employeeId)
      : undefined;

    return {
      start,
      size,
      color,
      period,
      groupId: `${employee.employeeId}-${period.typeId}-${period.startDate}-${period.endDate}`,
      hasIntersection,
      intersectionTooltip,
      variant,
    };
  }

  private getCellVariant(
    period: VacationPeriodInterface,
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

  private getCellColor(period: VacationPeriodInterface): string {
    if (
      period.linkedIssueId &&
      period.status !== 'onApproval' &&
      period.status !== 'cancelled'
    ) {
      return 'var(--done)';
    }

    return this.utils.getPeriodColor(
      this.businessTripService.statusTypesMap(),
      period,
    );
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
}
