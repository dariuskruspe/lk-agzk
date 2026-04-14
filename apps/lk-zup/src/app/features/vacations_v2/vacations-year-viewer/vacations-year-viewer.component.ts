import {
  CalendarGraph,
  CalendarGraphCellComponent,
  CalendarGraphCellPart,
  CalendarGraphEmployeeNameCellComponent,
  CalendarGraphEmployeeNameCellData,
  CalendarGraphLegendComponent,
} from '@app/shared/features/calendar-graph-v2';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  GridBodyComponent,
  GridColComponent,
  GridComponent,
  GridHeaderComponent,
  GridRowComponent,
} from '@app/shared/features/grid';
import {
  VacationsService,
  VacationItemComputed,
} from '../shared/vacations.service';
import {
  VacationPeriodInterface,
} from '@app/features/vacations/models/vacations.interface';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AppSelectButtonComponent } from '@app/shared/components/app-select-button/app-select-button.component';
import { AppSelectButtonOptionComponent } from '@app/shared/components/app-select-button/app-select-button-option/app-select-button-option.component';
import { ButtonModule } from 'primeng/button';
import { AppButtonComponent } from '@app/shared/components/app-button/app-button.component';
import { ArrowDownToLineIcon, PlusIcon } from 'lucide-angular';
import { EmployeeVacationsService } from '@app/shared/features/calendar-graph/services/employee-vacations.service';
import { LangFacade } from '@app/shared/features/lang/facades/lang.facade';
import { getMonthList } from '@app/shared/utils/datetime/common';
import { VacationUtilsService } from '../shared/vacation-utils.service';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';

interface GridRowData {
  vacation: VacationItemComputed;
  employee: CalendarGraphEmployeeNameCellData;
  rows: {
    cells: GridCellData[];
  }[];
}

interface GridCellData {
  parts: CalendarGraphCellPart[];
}

@Component({
  selector: 'app-vacations-year-viewer',
  imports: [
    GridComponent,
    GridHeaderComponent,
    GridRowComponent,
    GridColComponent,
    GridBodyComponent,
    CalendarGraph,
    CalendarGraphCellComponent,
    CalendarGraphEmployeeNameCellComponent,
    SelectButtonModule,
    AppSelectButtonComponent,
    AppSelectButtonOptionComponent,
    ButtonModule,
    AppButtonComponent,
    CalendarGraphLegendComponent,
    CheckboxModule,
    FormsModule,
    TooltipModule,
  ],
  templateUrl: './vacations-year-viewer.component.html',
  styleUrl: './vacations-year-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class VacationsYearViewerComponent {
  private langFacade = inject(LangFacade);
  private vacationsService = inject(VacationsService);
  private utils = inject(VacationUtilsService);
  private employeeVacationsService = inject(EmployeeVacationsService);

  employeeClick = output<VacationItemComputed>();

  enableSelection = this.employeeVacationsService.enableEmployeeSelectionSignal;
  selectedIds = this.employeeVacationsService.selectedEmployeeIdsSignal;

  vacations = this.vacationsService.filteredVacations;
  statusTypes = this.vacationsService.vacationStatusTypes;
  loading = this.vacationsService.loading;
  viewType = this.vacationsService.viewType;
  year = this.vacationsService.year;
  lang = this.langFacade.langSignal;

  header = signal(
    getMonthList(this.lang(), 'long').map((name) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
    })),
  );

  value = computed(() => {
    const result = this.mapVacationsToGridData(this.vacations());
    return result;
  });

  ArrowDownToLineIcon = ArrowDownToLineIcon;
  PlusIcon = PlusIcon;

  onEmployeeClick(vacation: VacationItemComputed): void {
    this.employeeClick.emit(vacation);
  }

  onEmployeeCheckboxChange(ids: string[]): void {
    this.employeeVacationsService.setSelectedEmployeeIds(ids);
    const filteredVacations = this.vacationsService.filteredVacations();
    this.employeeVacationsService.setSelectedEmployeeVacations(
      filteredVacations.filter((v) => ids.includes(v.employeeId)),
    );
    this.employeeVacationsService.allEmployeeCheckboxSignal.set(
      ids.length > 0 && ids.length === filteredVacations.length,
    );
  }

  constructor() {
    effect(() => {
      console.log(
        'value',
        this.value(),
        this.vacationsService.statusTypes(),
        this.vacationsService.states(),
      );
    });
  }

  private mapVacationsToGridData(
    vacations: VacationItemComputed[],
  ): GridRowData[] {
    return vacations.map((employee) => ({
      vacation: employee,
      employee: {
        name: employee.name,
        fullName: employee.fullName || employee.name,
        position: employee.position || '',
        departmentName: employee.departmentName,
        isCurrentUser: employee.isCurrentUser,
        isManager: employee.isManager,
        hasUnsignedPeriods:
          !!employee.subordinated &&
          employee.periods.some((p) => !p.approved && p.activeApprovement),
        clickable: true,
      },
      rows: [
        {
          cells: this.createYearCells(employee),
        },
      ],
    }));
  }

  private createYearCells(employee: VacationItemComputed): GridCellData[] {
    const cells: GridCellData[] = [];

    for (let month = 0; month < 12; month++) {
      const monthParts = this.getMonthParts(employee, month);
      cells.push({ parts: monthParts });
    }

    return cells;
  }

  private getMonthParts(
    employee: VacationItemComputed,
    month: number,
  ): CalendarGraphCellPart[] {
    const parts: CalendarGraphCellPart[] = [];
    const year = this.vacationsService.year();

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
    employee: VacationItemComputed,
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

    const color = this.utils.getPeriodColor(
      this.vacationsService.statusTypesMap(),
      period,
    );

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

    if (employeeNames.length === 0) {
      return '';
    }

    return `Пересечение отпуска с ${employeeNames.join(', ')}`;
  }
}
