import { CalendarGraphMonthCell } from '@app/shared/features/calendar-graph-v2';
import {
  BusinessTripItemComputed,
  BusinessTripPeriodComputed,
} from '../shared/business-trip.service';

export type BusinessTripMonthCell = CalendarGraphMonthCell & {
  period: BusinessTripPeriodComputed;
  vacation: BusinessTripItemComputed;
};

export type BusinessTripRowVm = {
  trip: BusinessTripItemComputed;
  name: string;
  fullName: string;
  position: string;
  departmentName?: string;
  isCurrentUser?: boolean;
  cells: (BusinessTripMonthCell | null)[];
};
