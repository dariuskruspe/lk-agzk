export type CalendarGraphCellVariant =
  | 'default'
  | 'approving'
  | 'cancelled'
  | 'withReport';

export type CalendarGraphPeriodLike = {
  startDate: string | Date;
  endDate: string | Date;
  typeId?: string | number | null;
};

export type CalendarGraphMonthCell = {
  groupId: string;
  color: string;
  period: CalendarGraphPeriodLike;
  hasIntersection: boolean;
  intersectionTooltip?: string;
  variant?: CalendarGraphCellVariant;
};

export type CalendarGraphCellPart = {
  start: number;
  size: number;
  color: string;
  period: CalendarGraphPeriodLike;
  groupId: string;
  hasIntersection?: boolean;
  intersectionTooltip?: string;
  variant?: CalendarGraphCellVariant;
};

export type CalendarGraphEmployeeNameCellData = {
  name: string;
  fullName?: string;
  position?: string;
  departmentName?: string;
  isCurrentUser?: boolean;
  isManager?: boolean;
  hasUnsignedPeriods?: boolean;
  clickable?: boolean;
};
