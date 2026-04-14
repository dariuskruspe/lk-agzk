/*******************************************************
 * Функции для работы с датами/временем и их периодами *
 *******************************************************/

import { HOLIDAYS_RU } from '@shared/constants/datetime/holidays/RU/common';
import { HolidayInterface } from '@shared/interfaces/datetime/holidays/holidays.interface';

/**
 * Получаем список месяцев для указанной языковой локали.
 *
 * См. [How to get month list in your locale]{@link https://dev.to/pretaporter/how-to-get-month-list-in-your-language-4lfb}
 *
 * @param locales языковая локаль, например, 'ru' или 'en'
 * @param monthFormat (формат вывода месяца, см. интерфейс Intl.DateTimeFormatOptions -> month)
 * @returns массив названий месяцев на выбранном языке в указанном формате
 */
export function getMonthList(
  locales: string | string[] = 'en',
  monthFormat: 'long' | 'short' = 'long',
): string[] {
  const year = new Date().getFullYear(); // 2020
  const monthList = [...Array(12).keys()]; // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const formatter = new Intl.DateTimeFormat(locales, {
    month: monthFormat,
  });

  const getMonthName = (monthIndex: number) =>
    formatter.format(new Date(year, monthIndex));

  return monthList.map(getMonthName);
}

/**
 * Получаем количество дней в указанном месяце (в случае февраля: в зависимости от того, является ли год високосным).
 *
 * @param monthIndex индекс месяца (0 - январь, 1 - февраль, ..., 11 - декабрь)
 * @param isLeap является ли год високосным (366 дней, т. к. в феврале 29)
 */
export function daysInMonth(
  monthIndex: number,
  isLeap: boolean = false,
): number {
  return [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
    monthIndex
  ];
}

/**
 * Проверяем, является ли год високосным (366 дней, т. к. в феврале 29).
 *
 * @param year
 */
export function isLeapYear(year: number): boolean {
  // Год является високосным, если он делится без остатка на 4, за исключением годов, которые делятся без остатка на 100
  // (например, 1900 или 2000) — они являются високосными, только если делятся без остатка на 400.
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

/**
 * Returns a date set to the beginning of the month
 *
 * @link https://stackoverflow.com/questions/222309/calculate-last-day-of-month
 *
 * @param {Date} myDate
 * @returns {Date}
 */
export function beginningOfMonth(myDate: number | string | Date): Date {
  let date: Date = new Date(myDate);
  date.setDate(1);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

/**
 * Returns a date set to the end of the month
 *
 * @link https://stackoverflow.com/questions/222309/calculate-last-day-of-month
 *
 * @param {Date} myDate
 * @returns {Date}
 */
export function endOfMonth(myDate: number | string | Date): Date {
  let date: Date = new Date(myDate);
  date.setDate(1); // Avoids edge cases on the 31st day of some months
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);
  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(59);
  date.setMilliseconds(999);
  return date;
}

/**
 * Возвращаем дату, установленную в самое начало года (00:00:00:000, 1 января).
 *
 * @param {Date} myDate исходная дата, по которой определяем год
 * @param isYear если true, то передаём не дату, а год
 * @returns {Date}
 */
export function beginningOfYear(
  myDate: number | string | Date,
  isYear: boolean = false,
): Date {
  let year: number;

  if (isYear) {
    switch (typeof myDate) {
      case 'string':
        try {
          year = parseInt(myDate);
        } catch (e) {
          throw e;
        }
        break;

      case 'number':
        year = myDate;
        break;

      default:
        throw new Error('[beginningOfYear]: Unknown year type');
    }
  }

  let date: Date = new Date(myDate);
  return new Date(isYear ? year : date.getFullYear(), 0, 1);
}

/**
 * Возвращаем дату, установленную в самый конец года (последняя миллисекунда 31 декабря).
 *
 * @param {Date} myDate исходная дата, по которой определяем год
 * @param isYear если true, то передаём не дату, а год
 * @returns {Date}
 */
export function endOfYear(
  myDate: number | string | Date,
  isYear: boolean = false,
): Date {
  let year: number;

  if (isYear) {
    switch (typeof myDate) {
      case 'string':
        try {
          year = parseInt(myDate);
        } catch (e) {
          throw e;
        }
        break;

      case 'number':
        year = myDate;
        break;

      default:
        throw new Error('[endOfYear]: Unknown year type');
    }
  }

  let date: Date = new Date(myDate);
  return new Date(isYear ? year : date.getFullYear(), 11, 31, 23, 59, 59, 999);
}

/**
 * Проверяем, является ли переданная дата выходным днём (субботой/воскресеньем).
 *
 * @param date дата
 */
export function isWeekend(date: Date): boolean {
  if (date && date.getFullYear) {
    const dateUTC: Date = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    return dateUTC.getDay() === 0 || dateUTC.getDay() === 6; // 6 = Saturday (суббота), 0 = Sunday (воскресенье)
  }
  return false
}

/**
 * Проверяем, является ли переданная дата нерабочим праздничным днём (то есть праздником, таким как Новый год,
 * 23 февраля, 8 марта и т. д.) согласно Трудовому кодексу Российской Федерации.
 *
 * @param date дата
 */
export function isHolidayRU(date: Date): boolean {
  const dateUTC: Date = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayOfMonth: number = dateUTC.getDate();
  const month: number = dateUTC.getMonth();
  return HOLIDAYS_RU.some(
    (holiday: HolidayInterface) =>
      holiday.day === dayOfMonth && holiday.month === month,
  );
}

/**
 * Проверяем, является ли переданная дата праздничным днём в определённой стране.
 *
 * @param date дата
 * @param countryCode двухбуквенный код страны согласно стандарту ISO 3166-1 alpha-2 (по умолчанию 'RU'
 * [Россия], см. https://ru.wikipedia.org/wiki/ISO_3166-1)
 *
 * Очень оптимистичное примечание: если когда-нибудь система выйдет на международный уровень, то можно будет смело
 * использовать npm-пакет https://www.npmjs.com/package/date-holidays ^_^
 */
export function isHoliday(date: any, countryCode: string = 'RU'): boolean {
  switch (countryCode) {
    case 'RU':
      return isHolidayRU(date);
  }

  return false;
}

/**
 * Проверяем, являются ли две переданные даты одним и тем же днём.
 *
 * @param d1 дата 1
 * @param d2 дата 2
 */
export function sameDate(d1: Date, d2: Date): boolean {
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  return (
    d1.getUTCDate() === d2.getUTCDate() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCFullYear() === d2.getUTCFullYear()
  );
}

/**
 * Проверяем, является ли переданная дата сегодняшним днём.
 *
 * @param date дата
 */
export function isToday(date: Date): boolean {
  const today: Date = new Date();
  return sameDate(date, today);
}

/**
 * Проверяем, входит ли переданная дата в указанный диапазон дат.
 *
 * @param d проверяемая дата
 * @param range диапазон дат
 * @param options (необязательный параметр) опции
 */
export function isDateInRange(
  d: Date,
  range: { start: Date; end: Date },
  options: {
    // Включать ли края диапазона при проверке
    includeEdges: boolean;
  } = { includeEdges: true },
): boolean {
  return options.includeEdges
    ? d.getTime() >= range.start.getTime() && d.getTime() <= range.end.getTime()
    : d.getTime() > range.start.getTime() && d.getTime() < range.end.getTime();
}

/**
 * Функция для проверки пересечения двух диапазонов дат.
 *
 * @param range1 первый диапазон дат
 * @param range2 второй диапазон дат
 */
export function isDateRangeOverlap(
  range1: { start: Date; end: Date },
  range2: { start: Date; end: Date },
): boolean {
  // Проверка условий пересечения диапазонов (начало одного диапазона находится до конца другого и наоборот)
  return range1.start <= range2.end && range2.start <= range1.end;
}

/**
 * Получаем массив дат, которые соответствуют первым дням всех месяцев, встречающихся в заданном диапазоне дат.
 *
 * @param range диапазон дат (период)
 */
export function getFirstDaysOfMonthsInRange(range: {
  start: Date;
  end: Date;
}): Date[] {
  const startDate: Date = new Date(range.start);
  const endDate: Date = new Date(range.end);

  // Проверяем, что дата начала меньше или равна дате окончания
  if (startDate > endDate) {
    throw new Error(
      '[utils -> datetime -> common.ts]: getMonthsInRange: start date must be less than or equal to end date',
    );
  }

  // Массив для хранения дат, соответствующих первым дням тех месяцев, которые встречаются в заданном диапазоне дат.
  const firstDaysOfMonths: Date[] = [];

  // Дата, соответствующая первому дню текущего месяца в цикле.
  let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

  // Пока дата, соответствующая началу текущего месяца, меньше или равна конечной дате
  while (current <= endDate) {
    // Добавляем её в массив
    firstDaysOfMonths.push(new Date(current));

    // Переходим к следующему месяцу
    current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  }

  return firstDaysOfMonths;
}
