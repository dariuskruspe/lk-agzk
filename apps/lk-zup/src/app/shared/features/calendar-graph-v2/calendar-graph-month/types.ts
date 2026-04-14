import { InputSignal, Type } from '@angular/core';

export type CalendarGraphMonthDay = {
  day: number;
  name: string;
  weekDay: string;
  isWeekend: boolean;
};

export type CalendarGraphMonthStickyConfig = {
  top?: string;
  bottom?: string;
};

export type CalendarGraphTemplateSelectFn<T> = (
  row: T,
  day: CalendarGraphMonthDay,
) => Type<any>;

export type CalendarGraphMonthConfig = {
  dayCellRender: (
    row: any,
    day: CalendarGraphMonthDay,
  ) => CalendarGraphMonthCellRenderConfig;
  minDayColWidth: number;

  summaryCell?: CalendarGraphCellConfig;
  targetCell?: CalendarGraphCellConfig;
  headerSticky?: CalendarGraphMonthStickyConfig;

  trackBy: (row: unknown) => string;
};

export type CalendarGraphMonthCellRenderConfig = {
  component: Type<any>;
  sizePx?: number;
  styleClass?: string;
};

export type ICalendarCellInputs<T> = {
  row: InputSignal<T>;
  day: InputSignal<CalendarGraphMonthDay>;
};

export type ICalendarCellTargetInputs<T> = {
  row: InputSignal<T>;
};

export type ICalendarCellSummaryInputs<T> = {
  row: InputSignal<T>;
};

export type CalendarGraphCellConfig = {
  cellRender: CalendarGraphMonthCellRenderConfig;
  header: string;
};
