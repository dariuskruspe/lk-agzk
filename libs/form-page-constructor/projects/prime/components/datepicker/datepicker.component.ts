import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import { Calendar, CalendarTypeView } from 'primeng/calendar';
import { Observable } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { DaysOffInterface } from '../../models/days-off.interface';
import { BaseComponent } from '../../../base/components/fpc-components/base-component/base.component';
import { ValidatorsUtils } from '../../../base/utils/validators.utils';
import { FpcInputsInterface } from '../../../base/models/fpc.interface';
import { toUnzonedDate } from '../../../base/utils/to-unzoned-date.util';
import moment from 'moment';

@Component({
    selector: 'fpc-datepicker',
    templateUrl: './datepicker.component.html',
    styleUrls: ['./datepicker.component.scss'],
    standalone: false
})
export class DatepickerComponent
  extends BaseComponent
  implements AfterViewInit
{
  minDate: Date;

  maxDate: Date;

  view: CalendarTypeView = 'date';

  defaultDateToOpen: Date;

  disabledDates: Date[] = [];

  /**
   * Массив разрешенных дат. Если задан, то все даты кроме указанных в этом массиве будут заблокированы.
   * Работает аналогично disabledDates, но в обратном порядке - блокирует все даты кроме указанных.
   *
   * @example
   * // Разрешить только определенные даты
   * [enableDates]="[new Date('2024-01-15'), new Date('2024-01-20'), new Date('2024-02-01')]"
   *
   * @example
   * // Разрешить только сегодняшнюю дату
   * [enableDates]="[new Date()]"
   */
  @Input() enableDates: (string | number)[] = [];

  @Input() set defaultDate(value: any) {
    if (value) {
      this.defaultDateToOpen = new Date(value);
    }
  }

  @Input() set period(value: CalendarTypeView) {
    this.view = value;
  }

  @Input() set min(value: any) {
    if (value) {
      this.minDate = moment(value).startOf('day').toDate();
      // если текущее зачение меньше минимума, очищаем поле
      if (
        this.form?.get(this.item.formControlName)?.value &&
        this.minDate >
          new Date(this.form?.get(this.item.formControlName)?.value)
      ) {
        this.form.get(this.item.formControlName).setValue('');
      }
    } else {
      this.minDate = null;
    }
  }

  @Input() set max(value: any) {
    if (value) {
      this.maxDate = moment(value).endOf('day').toDate();
          // если текущее зачение больше максимума, очищаем поле
    if (this.form?.get(this.item.formControlName)?.value && this.maxDate < new Date(this.form?.get(this.item.formControlName)?.value)) {
      this.form.get(this.item.formControlName).setValue('');
    }
    } else {
      this.maxDate = null;
    }
  }

  @Input() schedule: DaysOffInterface;

  @Input() requiredWorkday: boolean = false;

  @ViewChild('pCalendar') pCalendar: Calendar;

  firstSet = false;

  private bufferedShortDate: Date | null;

  constructor(
    @Optional()
    @Inject('asyncValidators')
    private asyncValidators: {
      getValidator: (
        key: string,
      ) => (control: any, item: FpcInputsInterface) => Observable<any>;
    },
    private cdr: ChangeDetectorRef,
    private validators: ValidatorsUtils,
  ) {
    super();
  }

  ngAfterViewInit(): void {
    if (this.form.get(this.item.formControlName).value) {
      this.firstSet = true;
      this.dateBinding(
        this.item.formControlName,
        this.form.get(this.item.formControlName).value,
      );
      this.firstSet = false;
    }
  }

  /**
   * Вычисляет заблокированные даты на основе разрешенных дат
   * Если enableDates задан, то блокируются все даты кроме указанных в enableDates
   * Если enableDates содержит числа, то это доступные дни месяца (1-31), а остальные заблокированы
   */
  get computedDisabledDates(): Date[] {
    if (!this.enableDates || this.enableDates.length === 0) {
      return this.disabledDates;
    }

    // Проверяем, содержит ли enableDates только числа (дни месяца)
    const isMonthDays = this.enableDates.every(
      (item) => typeof item === 'number' && item >= 1 && item <= 31,
    );

    if (isMonthDays) {
      // Если это дни месяца, блокируем все даты, кроме указанных дней месяца
      const disabledDates: Date[] = [];
      const enableDaysSet = new Set(this.enableDates as number[]);

      // Определяем диапазон дат для блокировки
      const startDate = this.minDate || new Date();
      const endDate = this.maxDate || new Date();

      // Если maxDate не задан, берем год вперед от текущей даты
      if (!this.maxDate) {
        endDate.setFullYear(endDate.getFullYear() + 3);
      }

      // Если minDate не задан, берем год назад от текущей даты
      if (!this.minDate) {
        startDate.setFullYear(startDate.getFullYear() - 1);
      }

      // Генерируем даты для блокировки в заданном диапазоне
      for (
        let date = new Date(startDate);
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        const dayOfMonth = date.getDate();
        if (!enableDaysSet.has(dayOfMonth)) {
          disabledDates.push(new Date(date));
        }
      }

      return disabledDates;
    } else {
      // Оригинальная логика для дат
      const disabledDates: Date[] = [];
      const enableDatesSet = new Set(
        this.enableDates.map((date) =>
          this.normalizeDate(new Date(date)).getTime(),
        ),
      );

      // Определяем диапазон дат для блокировки
      const startDate = this.minDate || new Date();
      const endDate = this.maxDate || new Date();

      // Если maxDate не задан, берем год вперед от текущей даты
      if (!this.maxDate) {
        endDate.setFullYear(endDate.getFullYear() + 3);
      }

      // Если minDate не задан, берем год назад от текущей даты
      if (!this.minDate) {
        startDate.setFullYear(startDate.getFullYear() - 1);
      }

      // Генерируем даты для блокировки в заданном диапазоне
      for (
        let date = new Date(startDate);
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        const normalizedDate = this.normalizeDate(date);
        if (!enableDatesSet.has(normalizedDate.getTime())) {
          disabledDates.push(new Date(normalizedDate));
        }
      }

      return disabledDates;
    }
  }

  /**
   * Нормализует дату, убирая время
   */
  private normalizeDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  dateBinding(formControlName: string, event: Event | Date): void {
    let stringWithoutTimezone = (this.pCalendar?.value as Date)?.toISOString();

    let dateWithoutTimezone = this.convertDateToUnzoned(
      new Date(stringWithoutTimezone),
    );

    if (!dateWithoutTimezone) {
      this.bufferedShortDate = this.parseShortYear(stringWithoutTimezone);
      if (this.bufferedShortDate) {
        dateWithoutTimezone = this.convertDateToUnzoned(this.bufferedShortDate);
        this.bufferedShortDate = null;
      } else {
        this.form.get(formControlName).setValue('');
      }
    }
    if (!stringWithoutTimezone) {
      dateWithoutTimezone = this.convertDateToUnzoned(event as Date);
    }
    try {
      this.form.patchValue({ [formControlName]: dateWithoutTimezone });
    } catch (e) {}

    if (dateWithoutTimezone) {
      const month = `${dateWithoutTimezone.getMonth() + 1}`;
      const parsedMonth = month.length === 1 ? `0${month}` : month;
      const day = `${dateWithoutTimezone.getDate()}`;
      const parsedDay = day.length === 1 ? `0${day}` : day;
      // Записывает в контрол тип выбранного дня
      // @ts-ignore
      this.form.get(this.item.formControlName)._dayType =
        this.schedule?.[
          `${dateWithoutTimezone?.getFullYear()}.${parsedMonth}.${parsedDay}`
        ] === 'dayOff'
          ? 'dayOff'
          : this.daysOff?.[
                `${dateWithoutTimezone?.getFullYear()}.${parsedMonth}.${parsedDay}`
              ] === 'holiday'
            ? 'holiday'
            : 'workDay';
    }

    const current = this.form.get(formControlName).value;
    const minControl = this.form.get(this.item?.startDateControl);
    const min = minControl?.value;
    const maxControl = this.form.get(this.item?.endDateControl);
    const max = maxControl?.value;

    // Если это дата начала и эта дата начала это выходной - то заполняем ближайший рабочий день
    // @ts-ignore
    if (
      this.requiredWorkday &&
      maxControl &&
      // @ts-ignore
      this.form.get(this.item.formControlName)._dayType !== 'workDay'
    ) {
      this.getNextWorkDay();

      // Если заполнена дата окончания и это выходной, то проверяем есть ли между ними рабочие дни: если нет, очищаем дату окончания
      // @ts-ignore
      if (
        // @ts-ignore
        maxControl._dayType !== 'workDay' &&
        !this.hasWorkDay(
          this.form.get(this.item.formControlName).value,
          maxControl.value,
        )
      ) {
        maxControl.setValue('');
      }
    }

    if (!this.firstSet && ((min && current < min) ||
        (max && current > max) ||
        (this.minDate && current < this.minDate) ||
        (this.maxDate && current > this.maxDate))
    ) {
      console.log('current', current, min, max, this.minDate, this.maxDate);
      // Если больше чем дата окончания или меньше чем дата начала - сдвигаем начало и окончание
      if (min && current < min) {
        minControl.setValue('');
        this.form.get(formControlName).setValue(dateWithoutTimezone);
      } else if (max && current > max) {
        maxControl.setValue('');
        this.form.get(formControlName).setValue(dateWithoutTimezone);
      } else {
        this.form
          .get(formControlName)
          .setErrors({ outOfBounds: 'OUT_OF_BOUNDS' });
        this.form.get(formControlName).setValue('');
      }
    } else {
      // Асинхронный валидатор, для lts
      if (
        this.item.validations.find(v => typeof v === 'object' && Object.keys(v)[0] === 'workSchedule') &&
        !this.item.validations.find(v => typeof v === 'object' && (Object.keys(v)[0] === 'syncWorkSchedule') || (Object.keys(v)[0] === 'date'))
      ) {
        this.isWorkScheduled();
      }
    }

      // если текущее значение не содержится в enableDates, очищаем поле
      const currentValue = this.form?.get(this.item.formControlName)?.value ? new Date(this.form?.get(this.item.formControlName)?.value) : null;

      const currentFormatedValue =  currentValue ? moment(currentValue).format('YYYY.MM.DD') : null;
      const currentDayValue =  currentValue ? currentValue.getDate() : null;

      if (currentFormatedValue && this.enableDates?.length && !(this.enableDates.includes(currentFormatedValue) || this.enableDates.includes(currentDayValue))) {
        this.form.get(this.item.formControlName).setValue('');
      }
  }

  hasWorkDay(start: string, end: string): boolean {
    let result = false;

    for (
      let loopDate = new Date(start);
      loopDate < new Date(end);
      loopDate.setDate(loopDate.getDate() + 1)
    ) {
      const month = `${loopDate.getMonth() + 1}`;
      const parsedMonth = month.length === 1 ? `0${month}` : month;
      const day = `${loopDate.getDate()}`;
      const parsedDay = day.length === 1 ? `0${day}` : day;
      const dayType =
        this.schedule?.[
          `${loopDate?.getFullYear()}.${parsedMonth}.${parsedDay}`
        ] === 'dayOff'
          ? 'dayOff'
          : this.daysOff?.[
                `${loopDate?.getFullYear()}.${parsedMonth}.${parsedDay}`
              ] === 'holiday'
            ? 'holiday'
            : 'workDay';
      result = result && dayType === 'workDay';
    }

    return result;
  }

  getNextWorkDay(): void {
    const startDate = new Date(this.form.get(this.item.formControlName).value);
    let maxCount = 1;
    // @ts-ignore
    let dayType = this.form.get(this.item.formControlName)._dayType;
    let nextDate = new Date(startDate);

    do {
      nextDate.setDate(startDate.getDate() + maxCount);
      const month = `${nextDate.getMonth() + 1}`;
      const parsedMonth = month.length === 1 ? `0${month}` : month;
      const day = `${nextDate.getDate()}`;
      const parsedDay = day.length === 1 ? `0${day}` : day;
      dayType =
        this.schedule?.[
          `${nextDate?.getFullYear()}.${parsedMonth}.${parsedDay}`
        ] === 'dayOff'
          ? 'dayOff'
          : this.daysOff?.[
                `${nextDate?.getFullYear()}.${parsedMonth}.${parsedDay}`
              ] === 'holiday'
            ? 'holiday'
            : 'workDay';
      maxCount++;
    } while (dayType !== 'workDay' && maxCount < 7);

    // @ts-ignore
    this.form.get(this.item.formControlName)._nextWorkDay = nextDate;
  }

  private isWorkScheduled(): void {
    const control = this.form.get(this.item.formControlName);
    this.asyncValidators
      .getValidator('workSchedule')(control, this.item)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((v) => {
        control.setErrors(v);
        control.setValidators([
          ...this.validators.getList(this.item, this.form),
          () => v,
        ]);
        this.cdr.markForCheck();
      });
  }

  isWeekend(date: any): boolean {
    const type = this.item?.dateHighlightType || 'common';
    if (type === 'none') {
      return false;
    }

    switch (type) {
      case 'schedule':
        const month = `${date.month + 1}`;
        const parsedMonth = month.length === 1 ? `0${month}` : month;
        const day = `${date.day}`;
        const parsedDay = day.length === 1 ? `0${day}` : day;

        if (
          this.schedule &&
          this.schedule[`${date.year}.${parsedMonth}.${parsedDay}`]
        ) {
          return (
            this.schedule[`${date.year}.${parsedMonth}.${parsedDay}`] ===
            'dayOff'
          );
        }

        return false;
      case 'common':
      default:
        const parsedDate = toUnzonedDate(
          new Date(date.year, date.month, date.day),
        );
        return parsedDate.getDay() === 0 || parsedDate.getDay() === 6;
    }
  }

  isHoliday(date: any): boolean {
    const month = `${date.month + 1}`;
    const parsedMonth = month.length === 1 ? `0${month}` : month;

    const day = `${date.day}`;
    const parsedDay = day.length === 1 ? `0${day}` : day;

    if (
      this.daysOff &&
      this.daysOff[`${date.year}.${parsedMonth}.${parsedDay}`]
    ) {
      return (
        this.daysOff[`${date.year}.${parsedMonth}.${parsedDay}`] === 'holiday'
      );
    }
    return false;
  }

  private convertDateToUnzoned(date: Date): Date | null {
    if (!date || date.toString() === 'Invalid Date' || !date.getFullYear) {
      return null;
    }
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
  }

  private parseShortYear(date?: string): Date | undefined {
    if (!date) {
      return undefined;
    }
    const separator = this.dateLocale === 'en' ? '/' : '.';
    const modDate = date.split(separator);
    if (modDate.length !== 3) {
      return undefined;
    }
    let year: number | string = modDate.pop();
    if (year?.length === 2) {
      year = this.getYear(year) as number;
      const month = this.dateLocale === 'en' ? modDate.shift() : modDate.pop();
      const day = modDate[0];
      const parsedDate = new Date(Date.UTC(year, +month - 1, +day));
      if (parsedDate.toString() === 'Invalid Date') {
        return undefined;
      }
      return parsedDate;
    }
    return undefined;
  }

  private getYear(short: string): number {
    const parsedShort = +short;
    if (isNaN(parsedShort)) {
      return new Date().getFullYear();
    }
    if (parsedShort > 50) {
      return parsedShort + 1900;
    }
    return parsedShort + 2000;
  }
}
