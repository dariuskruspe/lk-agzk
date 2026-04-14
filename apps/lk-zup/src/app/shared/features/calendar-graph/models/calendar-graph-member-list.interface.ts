export interface CalendarGraphMemberListInterface {
  id: string;
  fullName: string;
  position: string;
}

export interface ScheduleDataMembersInterface {
  memberId: string;
  datePoints: CalendarGraphScheduleInterface;
}

export interface TimesheetDataMembersInterface {
  memberId: string;
  sumWorkTime: number;
  scheduleWorkTime: number;
  datePoints: CalendarGraphTimesheetInterface;
}

export interface CalendarGraphTimesheetInterface {
  [dateStr: string]: CalendarGraphDataDateInterface;
}

export interface CalendarGraphScheduleInterface {
  [dateStr: string]: CalendarGraphPeriodListInterface;
}

export interface CalendarGraphDataDateInterface {
  fullName: string;
  position: string;
  dateStr: string;
  datePoints: CalendarGraphDatePoints[];
  typeIds: string[];
  workTime?: number;
  scheduleWorkTime?: number;
}

export interface CalendarGraphDatePoints {
  name: string;
  value: string | number;
}

interface CalendarGraphPeriodListInterface {
  id: string;
  daysLength: number;
  typeId: string;
  approve: boolean;
  issueId: string;
}

export interface WorkStatusInterface {
  id: string;
  label: string;
  color: string;
  icon: string;
  plannedVacation: boolean;
  showGroup: WorkStatusGroup[];
  approving?: boolean;
  issueIdCancel?: string;
  issueIdChange?: string;
  issueIdCreate?: string;
  plan?: boolean;
  availibleAndLinkedIssue?: boolean;
}

export type WorkStatusGroup =
  | 'vacationSchedule'
  | 'timesheet'
  | 'businessTrips';

export interface CalendarGraphModalInfoInterface {
  fullName: string;
  position: string;
  typeIds: string[];
  datePoints: CalendarGraphDatePoints[];
  dateBegin: string;
  dateEnd: string;
  issueId: string;
  issueTypeId?: string;
  approve: boolean;
  employeeId: string;
}

export interface CalendarGraphParamsInterface {
  userId: string;
  requestType: 'add' | 'edit';
  datePointStartDate?: string;
  issueId: string;
}
