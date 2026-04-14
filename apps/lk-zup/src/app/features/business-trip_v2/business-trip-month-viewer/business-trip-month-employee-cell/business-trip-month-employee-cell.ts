import {
  CalendarGraphEmployeeNameCellComponent,
  CalendarGraphEmployeeNameCellData,
  ICalendarCellTargetInputs,
} from '@app/shared/features/calendar-graph-v2';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { BusinessTripRowVm } from '../types';

@Component({
  selector: 'app-business-trip-month-employee-cell',
  imports: [CalendarGraphEmployeeNameCellComponent],
  templateUrl: './business-trip-month-employee-cell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessTripMonthEmployeeCell
  implements ICalendarCellTargetInputs<BusinessTripRowVm>
{
  row = input<BusinessTripRowVm>();

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
      clickable: false,
    };
  });
}
