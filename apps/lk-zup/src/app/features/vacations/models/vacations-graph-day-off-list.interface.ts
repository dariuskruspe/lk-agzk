export interface VacationsGraphDayOffListInterface {
  [key: string]: DayType;
}

export type DayType = 'workDay' | 'dayOff' | typeof HOLIDAY;

export const HOLIDAY = 'holiday';
