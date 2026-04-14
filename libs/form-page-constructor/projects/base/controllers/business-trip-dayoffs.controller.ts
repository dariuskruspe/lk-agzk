import { UntypedFormGroup } from '@angular/forms';
import { BusinessTripDayoffsArrSmartControllerOptions } from '../models/fpc.interface';
import { FpcArrSmartController } from './shared';

export class BusinessTripDayoffsController extends FpcArrSmartController<BusinessTripDayoffsArrSmartControllerOptions> {
  private isWarnedForMissingDayControl = false;
  private excludedDateKeys = new Set<string>();
  private lastRangeKey: string | null = null;

  init() {
    this.canAddItems.set(false);
    this.canRemoveItems.set(true);
  }

  addItem(): void {
    // manual add is disabled by design for this controller
  }

  removeItem(value?: Record<string, unknown>): void {
    const options = this.resolveOptions();
    if (!value) {
      return;
    }

    const dateKey = this.params.toDateKey(value[options.dayControl]);
    if (dateKey) {
      this.excludedDateKeys.add(dateKey);
    }
  }

  updateForm(form: UntypedFormGroup): void {
    const arrControlName = this.Field.formControlName;
    if (!arrControlName) {
      return;
    }

    const options = this.resolveOptions();
    const hasDayControl = this.Field.arrSmartList?.some(
      (item) => item.formControlName === options.dayControl,
    );

    if (!hasDayControl) {
      if (!this.isWarnedForMissingDayControl) {
        this.isWarnedForMissingDayControl = true;
        // eslint-disable-next-line no-console
        console.warn(
          `[BusinessTripDayoffsController] Missing "${options.dayControl}" control in arrSmartList for "${arrControlName}"`,
        );
      }
      return;
    }

    const dateStart = this.parseDate(form.get(options.dateStartControl)?.value);
    const dateEnd = this.parseDate(form.get(options.dateEndControl)?.value);
    const arrayControl = this.params.getArrayControl(arrControlName);

    if (!dateStart || !dateEnd || dateStart.getTime() > dateEnd.getTime()) {
      this.excludedDateKeys.clear();
      this.lastRangeKey = null;
      if (arrayControl?.length) {
        this.params.replaceArrayItems(arrControlName, []);
      }
      return;
    }

    const rangeStartKey = this.params.toDateKey(dateStart);
    const rangeEndKey = this.params.toDateKey(dateEnd);
    const rangeKey =
      rangeStartKey && rangeEndKey ? `${rangeStartKey}|${rangeEndKey}` : null;

    if (this.lastRangeKey && this.lastRangeKey !== rangeKey) {
      this.excludedDateKeys.clear();
    }
    this.lastRangeKey = rangeKey;

    const daysMap = this.params.getDaysOffMap();
    const allWeekendDates = this.getWeekendDates(dateStart, dateEnd, daysMap);
    const allowedDateKeys = new Set(
      allWeekendDates
        .map((date) => this.params.toDateKey(date))
        .filter((key): key is string => Boolean(key)),
    );

    // keep exclusions relevant only for the active date range
    this.excludedDateKeys.forEach((key) => {
      if (!allowedDateKeys.has(key)) {
        this.excludedDateKeys.delete(key);
      }
    });

    const weekendDates = allWeekendDates.filter((date) => {
      const key = this.params.toDateKey(date);
      return key ? !this.excludedDateKeys.has(key) : true;
    });
    const weekendDateKeys = weekendDates.map((date) =>
      this.params.toDateKey(date),
    );
    const currentDateKeys =
      arrayControl?.controls.map((control) =>
        this.params.toDateKey(
          (control as UntypedFormGroup).getRawValue()?.[options.dayControl],
        ),
      ) ?? [];

    const isStructureEqual =
      currentDateKeys.length === weekendDateKeys.length &&
      weekendDateKeys.every((key, index) => key === currentDateKeys[index]);

    if (isStructureEqual) {
      arrayControl?.controls.forEach((control) => {
        control.get(options.dayControl)?.disable({ emitEvent: false });
      });
      return;
    }

    const valuesByDate = new Map<string, Record<string, unknown>>();

    arrayControl?.controls.forEach((control) => {
      const rawValue = (control as UntypedFormGroup).getRawValue() as Record<
        string,
        unknown
      >;
      const dateKey = this.params.toDateKey(rawValue?.[options.dayControl]);
      if (dateKey) {
        valuesByDate.set(dateKey, rawValue);
      }
    });

    const groups = weekendDates.map((date, index) => {
      const group = this.params.createSmartFormGroup(arrControlName, index);
      const dateKey = this.params.toDateKey(date);
      const preservedValue = dateKey ? valuesByDate.get(dateKey) : undefined;

      if (preservedValue) {
        group.patchValue(preservedValue, { emitEvent: false });
      }

      group.patchValue(
        {
          [options.dayControl]: date,
        },
        { emitEvent: false },
      );
      group.get(options.dayControl)?.disable({ emitEvent: false });

      return group;
    });

    this.params.replaceArrayItems(arrControlName, groups);
  }

  private getWeekendDates(
    dateStart: Date,
    dateEnd: Date,
    daysMap: Record<string, 'workDay' | 'dayOff' | 'holiday'>,
  ): Date[] {
    const result: Date[] = [];
    const current = new Date(dateStart);

    while (current.getTime() <= dateEnd.getTime()) {
      const key = this.params.toDateKey(current);
      const dayType = key ? daysMap[key] : undefined;
      if (dayType === 'dayOff' || dayType === 'holiday') {
        result.push(new Date(current));
      }
      current.setUTCDate(current.getUTCDate() + 1);
    }

    return result;
  }

  private parseDate(value: unknown): Date | null {
    if (!value) {
      return null;
    }

    const parsed = value instanceof Date ? value : new Date(value as any);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    return new Date(
      Date.UTC(
        parsed.getUTCFullYear(),
        parsed.getUTCMonth(),
        parsed.getUTCDate(),
      ),
    );
  }

  private resolveOptions(): Required<BusinessTripDayoffsArrSmartControllerOptions> {
    const options = this.getOptions() ?? {};

    return {
      dateStartControl: options.dateStartControl ?? 'dateBegin',
      dateEndControl: options.dateEndControl ?? 'dateEnd',
      dayControl: options.dayControl ?? 'dayRVD',
      compensationTypeControl: options.compensationTypeControl ?? 'payType1',
      compensationDayOffControl: options.compensationDayOffControl ?? 'dayOff1',
      dayTypeSource: options.dayTypeSource ?? 'daysOff',
    };
  }
}
