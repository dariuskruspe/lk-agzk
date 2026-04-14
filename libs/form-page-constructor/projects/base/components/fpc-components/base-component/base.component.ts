import {Component, inject, Input, OnDestroy} from '@angular/core';
import { Subject } from 'rxjs';
import {
  BoundaryMathDay,
  DaysOffInterface,
  FpcInputsInterface,
  FpcInterface,
  OptionListInterface,
  OptionListItemInterface, OptionListsByAliases,
} from '../../../models/fpc.interface';
import { UntypedFormGroup } from '@angular/forms';
import { getOffsetDate } from '../../../utils/math-days-offset.util';
import { isDateInvalid } from '../../../utils/is-date-invalid.util';

@Component({
    template: ``,
    styleUrls: ['./base.component.scss'],
    standalone: false
})
export class BaseComponent implements OnDestroy {
  @Input() item: FpcInputsInterface;

  @Input() optionList: OptionListInterface | OptionListsByAliases;

  @Input() formData: FpcInterface;

  @Input() dateLocale: string;

  @Input() form: UntypedFormGroup;

  @Input() controlsFilterOptionList: {};

  @Input() filterOptionList: () => void;

  @Input() reloadFilterOptionList: () => void;

  @Input() filterOptionListAlias: () => void;

  @Input() reloadFilterOptionListAlias: () => void;

  @Input() daysOff: DaysOffInterface;

  @Input() staticData: Record<string, unknown>;

  @Input() staticDataManager: Record<string, unknown>;

  isMobile: boolean = true;

  protected destroy$ = new Subject<void>();

  constructor() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (window.isDesktop) {
      this.isMobile = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showSelectItem(
    value: string | number | boolean | string[],
    list: OptionListItemInterface[],
  ): string {
    if (Array.isArray(value)) {
      const items = list?.filter((e) => value.includes(e.value));
      if (items?.length) {
        return items.map((e) => e.title || e.representation).join(', ');
      }
    } else {
      const item = list?.find((e) => e.value === value);
      if (item) {
        return item.title || item.representation;
      }
    }
    return '';
  }

  valueBinding(formControlName: string, event: Event, value: any = null): void {
    const target = event?.target as HTMLInputElement;
    const obj = {};
    obj[formControlName] = value ?? target?.value;
    this.form.patchValue(obj);
  }

  mathCurrentDateDay(value: number | BoundaryMathDay, reference: Date | string = new Date()): string {
    return getOffsetDate({value, reference, daysOff: this.daysOff})
  }

  dateBinding(formControlName: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const separator = target.value.indexOf('.') > -1 ? '.' : '/';
    const ds = target.value.split(separator).map((i) => parseInt(i, 10));
    const newDate =
      separator === '.'
        ? new Date(ds[2], ds[1] - 1, ds[0])
        : new Date(ds[2], ds[0] - 1, ds[1]);
    const dateWithoutTimezone = new Date(
      Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate())
    );
    try {
      this.form.patchValue({
        [formControlName]: dateWithoutTimezone.toISOString(),
      });
    } catch (e) {}
  }

  isDateInvalid(date: Date | string): boolean {
    return isDateInvalid(date);
  }

  isRequired(): boolean {
    return this.formData?.options?.markRequired && !!this.item?.validations?.find((v) => v === 'required' || v === 'dynamic-required');
  }

  keys(obj: Record<string, unknown>): string[] {
    return Object.keys(obj);
  }

  protected getDateDiffTotal(
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
        coincidences += 1;
      }
    }
    return Number.isNaN(coincidences) ? 0 : coincidences;
  }

  protected getDateDiffWithoutHolidays(
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
        if (this.daysOff?.[key] !== 'holiday') {
          coincidences += 1;
        }
      }
    }
    return Number.isNaN(coincidences) ? 0 : coincidences;
  }

  protected getDayOffListKey(d: Date): string {
    const day = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`;
    const month =
      d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;
    return `${d.getFullYear()}.${month}.${day}`;
  }

  protected getUnzonedDate(date: Date | string = ''): Date | null {
    let modDate = date;
    if (typeof date === 'string') {
      modDate = new Date(date || '');
    }
    if (!modDate || modDate?.toString() === 'Invalid Date') {
      modDate = new Date();
    }
    return new Date(
      Date.UTC(
        (modDate as Date).getFullYear(),
        (modDate as Date).getMonth(),
        (modDate as Date).getDate()
      )
    );
  }
}
