import {
  CalendarGraphEmployeeNameCellComponent,
  CalendarGraphEmployeeNameCellData,
  ICalendarCellTargetInputs,
} from '@app/shared/features/calendar-graph-v2';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { EmployeeVacationsService } from '@app/shared/features/calendar-graph/services/employee-vacations.service';
import { VacationsService } from '../../shared/vacations.service';
import { VacationsMonthViewerService } from '../vacations-month-viewer.service';
import { VacationRowVm } from '../types';

@Component({
  selector: 'app-vacations-month-employee-cell',
  imports: [CalendarGraphEmployeeNameCellComponent],
  templateUrl: './vacations-month-employee-cell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VacationsMonthEmployeeCell
  implements ICalendarCellTargetInputs<VacationRowVm>
{
  private viewerService = inject(VacationsMonthViewerService);
  private vacationsService = inject(VacationsService);
  private employeeVacationsService = inject(EmployeeVacationsService);

  row = input<VacationRowVm>();

  enableSelection = this.employeeVacationsService.enableEmployeeSelectionSignal;
  selectedIds = this.employeeVacationsService.selectedEmployeeIdsSignal;

  employee = computed<CalendarGraphEmployeeNameCellData>(() => {
    const row = this.row();
    if (!row) {
      return {
        name: '',
      };
    }

    return {
      name: row.name,
      fullName: row.fullName,
      position: row.position,
      departmentName: row.departmentName,
      isCurrentUser: row.isCurrentUser,
      isManager: row.isManager,
      hasUnsignedPeriods: row.hasUnsignedPeriods,
      clickable: true,
    };
  });

  onEmployeeClick(): void {
    const row = this.row();
    if (row) {
      this.viewerService.employeeClick$.next(row.vacation);
    }
  }

  onCheckboxChange(ids: string[]): void {
    this.employeeVacationsService.setSelectedEmployeeIds(ids);
    const filteredVacations = this.vacationsService.filteredVacations();
    this.employeeVacationsService.setSelectedEmployeeVacations(
      filteredVacations.filter((v) => ids.includes(v.employeeId)),
    );
    this.employeeVacationsService.allEmployeeCheckboxSignal.set(
      ids.length > 0 && ids.length === filteredVacations.length,
    );
  }
}
