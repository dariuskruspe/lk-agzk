import { BoundaryMathDay, DaysOffInterface, DaysType } from "../models/fpc.interface";
import { toUnzonedDate } from "./to-unzoned-date.util";

export function getOffsetDate(
  data: {
    value: number | BoundaryMathDay,
    reference?: Date | string,
    daysOff?: DaysOffInterface
  }
): string {
  const value = data?.value ?? 0;
  const reference = data?.reference ?? new Date();
  const daysOff = data?.daysOff ?? {};

  const offset = typeof value === 'number' ? value : value?.count ?? 0;
  const type = typeof value === 'number' ? 'day' : value?.type ?? 'day';
  const excluded = typeof value === 'number' ? [] : value?.excluded ?? [];
  const specificDate = typeof value === 'number' ? null : value?.specificDate ?? null;

  const currentDate = toUnzonedDate(reference);

  let dateWithOffset = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  switch (type) {
    case 'day':
      if (specificDate) {
        dateWithOffset = new Date(specificDate);
      } else {
        dateWithOffset = getDateByOffset(currentDate, offset, excluded, daysOff);
      }
      break;
    case 'month':
      if (offset === 0) {
        dateWithOffset = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
      } else if (offset > 0) {
        dateWithOffset = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + offset,
          0
        );
      } else if (offset < 0) {
        dateWithOffset = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + offset,
          1
        );
      }
      break;
    case 'year':
      if (offset === 0) {
        dateWithOffset = new Date(currentDate.getFullYear(), 0, 1);
      } else if (offset > 0) {
        dateWithOffset = new Date(currentDate.getFullYear() + offset, 0, 0);
      } else if (offset < 0) {
        dateWithOffset = new Date(currentDate.getFullYear() + offset, 0, 1);
      }
      break;
    default:
      dateWithOffset = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + offset
      );
      break;
  }

  const mathDate = toUnzonedDate(dateWithOffset);
  return mathDate.toISOString();
}

export function getDateByOffset(
  dateStart: string | Date,
  offset: number,
  excluded: DaysType[] = [],
  daysOff?: DaysOffInterface,
): Date {
  let modOffset = offset;
  let limit = 2500;
  let date = toUnzonedDate(dateStart);
  while (modOffset !== 0 && limit > 0) {
    const key = getDayOffListKey(date);
    modOffset > 0 ? date.setDate(date.getDate() + 1) : date.setDate(date.getDate() - 1);
    if (!excluded.includes(daysOff?.[key])) {
      modOffset > 0 ? modOffset-- : modOffset++;
    }
    limit--;
  }

  let key = getDayOffListKey(date);
  while (excluded.includes(daysOff?.[key]) && limit > 0) {
    limit--;
    date.setDate(date.getDate() + 1);
    key = getDayOffListKey(date);
  }
  return date;
}

export function getDayOffListKey(d: Date): string {
  const day = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`;
  const month =
    d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;
  return `${d.getFullYear()}.${month}.${day}`;
}
