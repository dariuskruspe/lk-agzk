import {
  CalendarGraphMonthCell,
} from '@app/shared/features/calendar-graph-v2';
import {
  VacationItemComputed,
  VacationPeriodComputed,
} from '../shared/vacations.service';

export type VacationMonthCell = CalendarGraphMonthCell & {
  period: VacationPeriodComputed;
  vacation: VacationItemComputed;
};

export type VacationRowVm = {
  vacation: VacationItemComputed;
  name: string;
  fullName: string;
  position: string;
  departmentName?: string;
  isCurrentUser: boolean;
  isManager: boolean;
  hasUnsignedPeriods: boolean;
  cells: (VacationMonthCell | null)[];
};
