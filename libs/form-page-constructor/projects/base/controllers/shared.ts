import { signal } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { DaysType, FpcInputsInterface } from '../models/fpc.interface';

export abstract class FpcArrSmartController<T> {
  readonly canAddItems = signal(true);
  readonly canRemoveItems = signal(true);

  readonly items = signal<FpcInputsInterface[]>([]);

  constructor(protected readonly params: IFpcArrSmartControllerInit) {}

  abstract init(): void;

  abstract addItem(): void;
  abstract updateForm(form: UntypedFormGroup): void;

  removeItem(_value?: Record<string, unknown>): void {}

  protected get Template() {
    return this.params.template;
  }
  protected get Field() {
    return this.params.field;
  }

  protected getOptions() {
    return this.params.field.arrSmartController?.options as T;
  }
}

export type IFpcArrSmartControllerInit = {
  field: FpcInputsInterface;
  form: UntypedFormGroup;
  template: FpcInputsInterface[];
  getArrayControl: (arrControlName: string) => UntypedFormArray | null;
  createSmartFormGroup: (
    arrControlName: string,
    length: number,
  ) => UntypedFormGroup;
  replaceArrayItems: (
    arrControlName: string,
    groups: UntypedFormGroup[],
  ) => void;
  toDateKey: (date: unknown) => string | null;
  getDaysOffMap: () => Record<string, DaysType>;
};
