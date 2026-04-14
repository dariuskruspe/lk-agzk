import { TimesheetScheduleDayType } from '@app/shared/features/timesheet-schedule';

const WORK_DAY_TYPE = 'Рабочий день';
const WORK_DAY_NAMES = new Set(['Рабочий день', 'Рабочее время']);

function isWorkDayType(dayType: TimesheetScheduleDayType): boolean {
  return (
    dayType.timeType === WORK_DAY_TYPE || WORK_DAY_NAMES.has(dayType.name)
  );
}

export function sortTimesheetDayTypes(
  dayTypes: TimesheetScheduleDayType[],
): TimesheetScheduleDayType[] {
  return dayTypes
    .map((dayType, index) => ({ dayType, index }))
    .sort((a, b) => {
      const priorityDiff =
        Number(isWorkDayType(b.dayType)) - Number(isWorkDayType(a.dayType));

      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      return a.index - b.index;
    })
    .map(({ dayType }) => dayType);
}
