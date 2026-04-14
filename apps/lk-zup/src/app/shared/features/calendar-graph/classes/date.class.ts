import { Injectable } from '@angular/core';
import moment from 'moment';
import {
  HOLIDAY,
  VacationsGraphDayOffListInterface,
} from '../../../../features/vacations/models/vacations-graph-day-off-list.interface';

@Injectable({
  providedIn: 'root',
})
export class DateClass {
  daysInMonth(year: number, month: number): number[] {
    const formattedDate = new Date(year, month, 1);
    const length =
      33 - new Date(formattedDate.getFullYear(), month, 33).getDate();
    return new Array(length);
  }

  getYear(date: Date | string): number {
    return new Date(date).getFullYear();
  }

  getUnzonedDate(date: string | Date): Date {
    let value = date;
    if (typeof date === 'string') {
      value = new Date(date);
    }
    if (value.toString()?.toLowerCase() === 'invalid date') {
      value = new Date();
    }
    return new Date(
      Date.UTC(
        (value as Date).getFullYear(),
        (value as Date).getMonth(),
        (value as Date).getDate()
      )
    );
  }

  getDaysNumberInAYear(date: Date): number {
    return (
      (Date.UTC(date.getFullYear() + 1, 0, -1) -
        Date.UTC(date.getFullYear(), 0, 0)) /
      24 /
      60 /
      60 /
      1000
    );
  }

  getDayOfAYear(date: Date): number {
    return (
      (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
        Date.UTC(date.getFullYear(), 0, 0)) /
      24 /
      60 /
      60 /
      1000
    );
  }

  getDateDiff(dateStart: string, dateEnd: string): number {
    return Number.isNaN(moment(dateEnd).diff(dateStart, 'd') + 1)
      ? 0
      : moment(dateEnd).diff(dateStart, 'd') + 1;
  }

  getDateDiffWithoutHolidays(
    dateStart: string,
    dateEnd: string,
    daysOff: VacationsGraphDayOffListInterface
  ): number {
    let coincidences = 0;
    if (dateStart && dateEnd) {
      for (
        let d = this.getUnzonedDate(dateStart);
        d <= this.getUnzonedDate(dateEnd);
        d.setDate(d.getDate() + 1)
      ) {
        const key = this.getDayOffListKey(d);
        if (daysOff?.[key] !== HOLIDAY) {
          coincidences += 1;
        }
      }
    }
    return Number.isNaN(coincidences) ? 0 : coincidences;
  }

  getDayOffListKey(d: Date): string {
    const day = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`;
    const month =
      d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;
    return `${d.getFullYear()}.${month}.${day}`;
  }

  separateDateTypes(
    dateStart: string,
    dateEnd: string,
    daysOff: VacationsGraphDayOffListInterface = {}
  ): {
    holiday: number;
    dayOff: number;
    workDay: number;
    total: number;
  } {
    const total = this.getDateDiff(dateStart, dateEnd);
    const coincidences = [];
    if (dateStart && dateEnd) {
      for (
        let d = this.getUnzonedDate(dateStart);
        d <= this.getUnzonedDate(dateEnd);
        d.setDate(d.getDate() + 1)
      ) {
        const key = this.getDayOffListKey(d);
        coincidences.push(daysOff[key] ?? 'workDay');
      }
    }

    const result = coincidences.reduce(
      (acc, day) => {
        acc[day] += 1;
        return acc;
      },
      {
        holiday: 0,
        dayOff: 0,
        workDay: 0,
        total,
      }
    );
    result.total = result.workDay + result.dayOff;

    return result;
  }

  getMonth(date: string | number): number {
    return new Date(date).getMonth();
  }

  getDate(date: string | number): number {
    return new Date(date).getDate();
  }

  getMonthCorrect(month: number): number {
    return month > 11 ? month - 12 : month;
  }

  dayNumberDate(year: number, month: number, day: number): number {
    return new Date(year, month, day).getDay();
  }

  getDateMathMonthCorrect(date: Date | string, month: number): string {
    return this.dateFormatCorrect(new Date(date).getMonth() + month + 1);
  }

  dateFormatCorrect(num: number | string): string {
    const modNum = typeof num === 'string' ? Number(num) : num;
    return (modNum < 10 ? '0' : '') + modNum;
  }

  getDateStr(
    date: Date | string,
    monthInd: number,
    dayInd: number | string
  ): string {
    return `${this.getYear(date)}.${this.getDateMathMonthCorrect(
      date,
      monthInd
    )}.${this.dateFormatCorrect(dayInd)}`;
  }

  dateConstruct(year: number, month: number, day: number): string {
    return new Date(year, month, day).toISOString();
  }

  getMonthPoints(dateStr: string, datePoints: string): string[] {
    const arr = [];
    const date = new Date(dateStr);
    const modDatePoints = datePoints;

    const day = 1;
    for (let i = 0; i <= 31; i += 1) {
      if (modDatePoints[this.getDateStr(date, 0, day + i)]) {
        modDatePoints[this.getDateStr(date, 0, day + i)].day = 1 + i;
        arr.push(modDatePoints[this.getDateStr(date, 0, day + i)]);
      }
    }
    return arr;
  }

  private toISOstring(date: moment.Moment | string): string {
    if (typeof date === 'string') {
      return date;
    }
    return date?.toISOString() ?? '';
  }
}
