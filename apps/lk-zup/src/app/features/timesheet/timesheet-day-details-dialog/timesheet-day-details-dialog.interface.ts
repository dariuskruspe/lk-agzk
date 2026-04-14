import { TimesheetScheduleDayType } from '@app/shared/features/timesheet-schedule';

export interface TimesheetDayDetailsDialogData {
  employeeName: string;
  date: string;
  hoursPlan: number | null;
  hoursFact: number | null;
  dayTypes: TimesheetScheduleDayType[];
  canOpenIssue?: boolean;
}
