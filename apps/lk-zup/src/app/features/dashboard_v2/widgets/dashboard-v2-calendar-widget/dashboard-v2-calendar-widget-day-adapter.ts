import { AppCalendarInputDay } from '@app/shared/components/app-calendar/app-calendar.component';
import {
  TimesheetMapper,
  TimesheetScheduleCalendarDay,
  TimesheetScheduleDayType,
} from '@app/shared/features/timesheet-schedule';
import { isHoliday, isWeekend } from '@app/shared/utils/datetime/common';
import { getContrastColor } from '@shared/utils/string/color/common';

const DEFAULT_WORKDAY_COLOR = 'var(--calendar-workday-color)';
const DEFAULT_DAYOFF_COLOR = 'var(--calendar-dayoff-color)';
const DEFAULT_DAYOFF_TEXT_COLOR = 'var(--calendar-dayoff-text-color)';
const DEFAULT_HOLIDAY_COLOR = 'var(--calendar-holiday-color)';
const HOLIDAY_TOOLTIP = 'Праздничный день';

type DashboardV2CalendarWidgetDayAdapterDeps = Pick<
  TimesheetMapper,
  'mapDay' | 'mapDayStyles'
>;

export function mapTimesheetScheduleDayToAppCalendarInputDay(
  day: TimesheetScheduleCalendarDay,
  deps: DashboardV2CalendarWidgetDayAdapterDeps,
): AppCalendarInputDay {
  const date = parseScheduleDate(day.date);
  const dayVm = deps.mapDay(day);
  const priorityDayType = getPriorityDayType(day);
  const hasFactWorkDay = day.dayType.some(
    (item) =>
      item.calendarType === 'fact' && item.timeType === 'Рабочий день',
  );

  return {
    date,
    tooltip: resolveTooltip(
      priorityDayType,
      date,
      dayVm.variant,
      hasFactWorkDay,
    ),
    style: resolveDayStyle(
      day,
      priorityDayType,
      deps,
      date,
      dayVm.variant,
      hasFactWorkDay,
    ),
  };
}

function resolveDayStyle(
  day: TimesheetScheduleCalendarDay,
  priorityDayType: TimesheetScheduleDayType | undefined,
  deps: DashboardV2CalendarWidgetDayAdapterDeps,
  date: Date,
  variant: ReturnType<DashboardV2CalendarWidgetDayAdapterDeps['mapDay']>['variant'],
  hasFactWorkDay: boolean,
) {
  if (variant === 'big-icon') {
    return createFilledStyle(
      resolvePriorityColor(priorityDayType, deps, DEFAULT_WORKDAY_COLOR),
    );
  }

  if (variant === 'small-icon') {
    return createOutlinedStyle(
      resolvePriorityColor(priorityDayType, deps, DEFAULT_WORKDAY_COLOR),
    );
  }

  if (isHoliday(date) && !hasDominantFactEvent(day) && !hasFactWorkDay) {
    return createTextStyle(
      normalizeColor(priorityDayType?.color, DEFAULT_HOLIDAY_COLOR),
    );
  }

  if (variant === 'dayoff') {
    if (isWeekend(date)) {
      const dayOffColor = normalizeColor(
        priorityDayType?.color,
        DEFAULT_DAYOFF_COLOR,
      );

      return createFilledStyle(
        dayOffColor,
        priorityDayType?.color
          ? getContrastColor(dayOffColor)
          : DEFAULT_DAYOFF_TEXT_COLOR,
      );
    }

    return createTextStyle(
      normalizeColor(priorityDayType?.color, DEFAULT_DAYOFF_COLOR),
    );
  }

  return createOutlinedStyle(
    resolvePriorityColor(priorityDayType, deps, DEFAULT_WORKDAY_COLOR),
  );
}

function createFilledStyle(fill: string, text?: string) {
  return {
    type: 'filled' as const,
    fill,
    text: text ?? getFilledTextColor(fill),
  };
}

function createOutlinedStyle(color: string) {
  return {
    type: 'outlined' as const,
    text: color,
    border: color,
  };
}

function createTextStyle(color: string) {
  return {
    type: 'text' as const,
    text: color,
  };
}

function resolveTooltip(
  priorityDayType: TimesheetScheduleDayType | undefined,
  date: Date,
  variant: ReturnType<DashboardV2CalendarWidgetDayAdapterDeps['mapDay']>['variant'],
  hasFactWorkDay: boolean,
): string {
  if (isHoliday(date) && variant === 'dayoff' && !hasFactWorkDay) {
    return HOLIDAY_TOOLTIP;
  }

  return priorityDayType?.name || priorityDayType?.timeType || '';
}

function resolvePriorityColor(
  priorityDayType: TimesheetScheduleDayType | undefined,
  deps: DashboardV2CalendarWidgetDayAdapterDeps,
  defaultColor: string,
): string {
  if (!priorityDayType) {
    return defaultColor;
  }

  const style = deps.mapDayStyles(priorityDayType);

  return normalizeColor(priorityDayType.color || style.color, defaultColor);
}

function normalizeColor(color: string | null | undefined, defaultColor: string) {
  return !color || color.toLowerCase() === '#ffffff' ? defaultColor : color;
}

function getFilledTextColor(fill: string) {
  return fill.startsWith('var(')
    ? DEFAULT_DAYOFF_TEXT_COLOR
    : getContrastColor(fill);
}

function parseScheduleDate(date: string): Date {
  const [datePart] = date.split('T');
  const [year, month, day] = datePart.split('-').map(Number);

  return new Date(year, month - 1, day);
}

function getPriorityDayType(day: TimesheetScheduleCalendarDay) {
  return (
    day.dayType.find(
      (item) =>
        item.calendarType === 'fact' &&
        item.timeType !== 'Рабочий день' &&
        item.timeType !== 'Выходной день',
    ) ||
    day.dayType.find(
      (item) => item.calendarType === 'fact' && item.timeType !== 'Рабочий день',
    ) ||
    day.dayType.find((item) => item.calendarType === 'fact') ||
    day.dayType.find(
      (item) => item.calendarType === 'plan' && item.timeType !== 'Выходной день',
    ) ||
    day.dayType[0]
  );
}

function hasDominantFactEvent(day: TimesheetScheduleCalendarDay): boolean {
  return day.dayType.some(
    (item) =>
      item.calendarType === 'fact' &&
      item.timeType !== 'Рабочий день' &&
      item.timeType !== 'Выходной день',
  );
}
