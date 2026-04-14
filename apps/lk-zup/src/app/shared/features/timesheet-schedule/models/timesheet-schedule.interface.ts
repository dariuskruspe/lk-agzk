export type TimesheetScheduleMode = 'my_timesheet' | 'team_timesheet';

/** Допустимые значения поля `timeType` в ответе schedule */
export const TIMESHEET_TIME_TYPES = [
  'Рабочий день',
  'Выходной день',
  'Командировка',
  'Отпуск',
  'Больничный',
  'Работа в выходной',
  'Сверхурочная работа',
  'Простой',
  'Отсутствие',
  'Заявка',
] as const;

export type TimesheetTimeType = (typeof TIMESHEET_TIME_TYPES)[number];

export const TIMESHEET_CALENDAR_TYPES = ['plan', 'fact'] as const;

export type TimesheetCalendarType = (typeof TIMESHEET_CALENDAR_TYPES)[number];
export interface GetTimesheetScheduleParams {
  startDate?: Date | string;
  endDate?: Date | string;
  mode?: TimesheetScheduleMode;
}

export interface TimesheetScheduleEmployee {
  id: string;
  name: string;
  position: string;
}

export interface TimesheetScheduleDayType {
  name: string;
  color: string;
  iconName: string;
  issueId: string;
  stateId: string;
  code: string;
  onApproval: boolean;
  hoursCountActual: number;
  hoursCountPlan: number;
  hoursCountDifference: number;
  /** Пустая строка, если тип дня не задаёт одно из известных значений */
  timeType: TimesheetTimeType | '';
  calendarType: TimesheetCalendarType;
}

export interface TimesheetScheduleCalendarDay {
  date: string;
  dayType: TimesheetScheduleDayType[];
  hoursCountActual: number;
  hoursCountPlan: number;
  hoursCountDifference: number;
}

export interface TimesheetScheduleRow {
  employeeDisplayName: string;
  employee: TimesheetScheduleEmployee;
  calendar: TimesheetScheduleCalendarDay[];
}

export type TimesheetScheduleResponse = TimesheetScheduleRow[];
