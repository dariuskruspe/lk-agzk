import { LucideIconData } from 'lucide-angular';
import { TimesheetScheduleDayType } from './timesheet-schedule.interface';

export interface TimesheetCellVm {
  date: string;
  day: number;
  dayTypes: TimesheetScheduleDayType[];
  variant: TimesheetCellVariant;
  hasUnapprovedIssues: boolean;
  hours: number | null;
  hoursFact: number | null;
  iconKind: 'lucide' | 'custom';
  icon: LucideIconData | string | null;
  color: string | null;
  bgColor: string | null;
}

export type TimesheetCellVariant =
  | 'big-icon'
  | 'small-icon'
  | 'text'
  | 'dayoff'
  | 'empty';

export type TimesheetDayStyle = {
  iconKind: 'lucide' | 'custom';
  icon: LucideIconData | string | null;
  color?: string;
  bgColor?: string;
};
