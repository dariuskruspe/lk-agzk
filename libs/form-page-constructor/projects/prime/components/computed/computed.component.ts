import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import moment from 'moment';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../base/components/fpc-components/base-component/base.component';
import {definePluralForm} from "../../../../../../apps/lk-zup/src/app/shared/utilits/pluralize.util";
import { TranslatePipe } from "../../../base/pipes/lang.pipe";
import {
  VacationsGraphDayOffListInterface
} from "../../../../../../apps/lk-zup/src/app/features/vacations/models/vacations-graph-day-off-list.interface";
import { DaysOffInterface } from '../../models/days-off.interface';


@Component({
    selector: 'fpc-computed',
    templateUrl: './computed.component.html',
    styleUrls: ['./computed.component.scss'],
    standalone: false
})
export class ComputedComponent extends BaseComponent implements OnChanges {
  @Input() formValue: Record<string, unknown>;

  @Input() schedule: DaysOffInterface;

  private readonly regex = /(\${[^{}]+})+/g;

  private initiated = false;
  constructor(private translatePipe: TranslatePipe) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((this.form || this.formValue) && this.item && this.staticData && this.daysOff && !this.initiated) {
      this.form.get(this.item.formControlName).setValue('', {emitEvent: false});
      this.initiated = true;
      this.setComputedValue();
      this.form.valueChanges.pipe(
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.setComputedValue();
      });
    } else {
      this.form.get(this.item.formControlName).setValue('', {emitEvent: false});
    }
    if (changes.staticDataManager?.currentValue) {
      this.setComputedValue();
    }
  }

  setComputedValue(): void {
    let computedValue;
    if (!this.item.computedStaticDateControls) {
      const execute = this.createExecutor();
      computedValue = this.computeValue(execute);
      this.form.get(this.item.formControlName).setValue(this.computeValue(execute), {emitEvent: false});
    } else {
      computedValue = this.getStaticText(
        this.separateDates(
          this.toISOstring(this.form.get(this.item.computedStaticDateControls.dateBeginControl).value),
          this.toISOstring(this.form.get(this.item.computedStaticDateControls.dateEndControl).value),
          this.daysOff
        )
      );
    }
    this.form.get(this.item.formControlName).setValue(computedValue, {emitEvent: false});
  }

  private computeValue(execute: (code: string) => string): string {
    return (this.item.value as string)
      .replace(this.regex, (match) => {
        return execute(match?.slice(2, match.length - 1).trim()) ?? '';
      });
  }

  private createExecutor(): (code: string) => string {
    const staticd = {...this.staticData};
    const staticdm = {...(this.staticDataManager ?? {})};
    const form = this.form?.getRawValue() || {...this.formValue};
    const formData = {...this.formData.data};
    const m = (date: string) => moment(date);
    const diff = (start: string, end: string): number => {
      return this.getDateDiffWithoutHolidays(start, end);
    }

    const diffWorkdayBySchedule = (start: string, end: string): number => {
      return this.getDateDiffWorkdayBySchedule(start, end);
    }

    const diffWorkdayByDaysOffList = (start: string, end: string): number => {
      return this.getDateDiffWorkdayByDaysOff(start, end);
    }

    const diffTotal = (start: string, end: string): number => {
      // return this.getDateDiffTotal(start, end);
      return this.getDateDiffTotal(start, end);
    }

    const sum = (arrayControl: string, controlName: string): number => {
      const values = (form[arrayControl] || []).map(arrayItem => {
        return !Number.isNaN(+arrayItem[controlName]) ? +arrayItem[controlName] : 0;
      });
      return this.getSumValues(values || []);
    }
    return function(code: string): string {
      // (!!!) ACHTUNG: использование eval (см. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)
      // TODO: переделать на изолированный вызов eval в песочнице
      if (!eval(`"use strict"; ${code}`)) {
        code = code.replace('form[', 'formData[');
        code = code.replace('form[', 'formData[');
        code = code.replace('form[', 'formData[');
        code = code.replace('form[', 'formData[');
      }
      return eval(`"use strict"; ${code}`);
      // return eval?.(`"use strict";(${code})`); // (!!!) непрямой вызов eval (indirect call through optional chaining) не подошёл в данном случае -> локальные переменные функции createExecutor ищутся в глобальной области видимости
      // return Function('"use strict"; return (' + code + ')')(); // почему-то не работает :(
    }
  }

  getDateDiffWorkdayByDaysOff(
    dateStart: string | Date,
    dateEnd: string | Date,
  ): number {
    let coincidences = 0;
    if (dateStart && dateEnd) {
      for (
        let d = this.getUnzonedDate(dateStart);
        d <= this.getUnzonedDate(dateEnd);
        d.setDate(d.getDate() + 1)
      ) {
        const key = this.getDayOffListKey(d);
        if (this.daysOff?.[key] === 'workDay') {
          coincidences += 1;
        }
      }
    }
    return Number.isNaN(coincidences) ? 0 : coincidences;
  }

  getDateDiffWorkdayBySchedule(
    dateStart: string | Date,
    dateEnd: string | Date,
  ): number {
    let coincidences = 0;
    if (dateStart && dateEnd) {
      for (
        let d = this.getUnzonedDate(dateStart);
        d <= this.getUnzonedDate(dateEnd);
        d.setDate(d.getDate() + 1)
      ) {
        const key = this.getDayOffListKey(d);
        if (this.schedule?.[key] === 'workDay') {
          coincidences += 1;
        }
      }
    }
    return Number.isNaN(coincidences) ? 0 : coincidences;
  }

  getSumValues(
    values: number[]
  ): number {
    let sum = 0;
    values.forEach(value => {
      sum = sum + value;
    })
    return sum;
  }

  protected getStaticText(days: {
    holiday: number;
    dayOff: number;
    workDay: number;
    total: number;
  }): string {
    localStorage.lang;
    return `${days.total} ${this.translatePipe.transform(
      definePluralForm(
        days.total,
        ['ONE_DAY', 'TWO_DAYS', 'PLURAL_DAYS'],
        this.dateLocale as 'ru' | 'en'
      ) as string
    )} (${days.workDay} ${this.translatePipe.transform(
      definePluralForm(
        days.workDay,
        ['ONE_WORKDAY', 'TWO_WORKDAYS', 'PLURAL_WORKDAYS'],
        this.dateLocale as 'ru' | 'en'
      ) as string
    )}, ${days.dayOff} ${this.translatePipe.transform(
      definePluralForm(
        days.dayOff,
        ['ONE_DAYOFF', 'TWO_DAYSOFF', 'PLURAL_DAYSOFF'],
        this.dateLocale as 'ru' | 'en'
      ) as string
    )}, ${days.holiday} ${this.translatePipe.transform(
      definePluralForm(
        days.holiday,
        ['ONE_HOLIDAY', 'TWO_HOLIDAY', 'PLURAL_HOLIDAY'],
        this.dateLocale as 'ru' | 'en'
      ) as string
    )})`;
  }

  protected separateDates(
    dateStart: string,
    dateEnd: string,
    daysOff: VacationsGraphDayOffListInterface
  ): {
    holiday: number;
    dayOff: number;
    workDay: number;
    total: number;
  } {
    return this.separateDateTypes(dateStart, dateEnd, daysOff);
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

  getDateDiff(dateStart: string, dateEnd: string): number {
    return Number.isNaN(moment(dateEnd).diff(dateStart, 'd') + 1)
      ? 0
      : moment(dateEnd).diff(dateStart, 'd') + 1;
  }

  protected toISOstring(date: moment.Moment | string | Date): string {
    if (date?.toString() === 'Invalid Date') {
      return '';
    }
    if (typeof date === 'string') {
      return date;
    }
    return date?.toISOString() ?? '';
  }
}
