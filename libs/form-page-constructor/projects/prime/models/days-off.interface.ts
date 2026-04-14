export interface DaysOffInterface {
  [key: string]: DaysType;
}

export type DaysType = 'workDay' | 'dayOff' | 'holiday';
