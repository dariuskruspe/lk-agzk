import {
  CalendarGraphEmployeeNameCellComponent,
  CalendarGraphEmployeeNameCellData,
} from '@app/shared/features/calendar-graph-v2';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { UserStateService } from '@app/shared/states/user-state.service';
import { TimesheetRowVm } from '../types';

@Component({
  selector: 'app-timesheet-employee-name-cell',
  imports: [CalendarGraphEmployeeNameCellComponent],
  templateUrl: './timesheet-employee-name-cell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetEmployeeNameCell {
  private userState = inject(UserStateService);

  row = input<TimesheetRowVm>();

  employee = computed<CalendarGraphEmployeeNameCellData>(() => {
    const row = this.row();
    if (!row) {
      return {
        name: '',
      };
    }

    return {
      name: row.employeeDisplayName,
      fullName: row.employee.name,
      position: row.employee.position,
      isCurrentUser: row.employee.id === this.userState.activeEmployeeId(),
      clickable: false,
    };
  });
}
