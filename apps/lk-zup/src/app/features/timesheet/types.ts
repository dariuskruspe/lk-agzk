import {
  TimesheetCellVm,
  TimesheetScheduleEmployee,
} from '@app/shared/features/timesheet-schedule';
import { TimesheetScheduleCalendarDay } from '@app/shared/features/timesheet-schedule';

export type TimesheetRowVm = {
  employeeDisplayName: string;
  employee: TimesheetScheduleEmployee;
  canOpenIssue: boolean;
  days: TimesheetCellVm[];
  summaryHours: number;
  summaryHoursFact: number;
};
