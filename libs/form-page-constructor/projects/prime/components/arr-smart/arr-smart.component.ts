import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../../base/components/fpc-components/base-component/base.component';
import { DaysOffInterface } from '../../models/days-off.interface';
import { UntypedFormArray } from '@angular/forms';
import {FpcInputsInterface, OptionListItemInterface} from '../../../base/models/fpc.interface';

@Component({
    selector: 'fpc-arr-smart',
    templateUrl: './arr-smart.component.html',
    styleUrls: ['./arr-smart.component.scss'],
    standalone: false
})
export class ArrSmartComponent extends BaseComponent implements OnChanges {
  @Output() addSmartGroup = new EventEmitter<string>();

  @Output() removeSmartGroup = new EventEmitter<{ name: string, index: number }>();

  @Input() schedule: DaysOffInterface;

  @Input() aliasesMatch: any[];

  @Input() canAddItems = true;

  @Input() canRemoveItems = true;

  disabledIndexes = new Set();

  private inited = false;

  constructor() {
    super();

  }

  addSmartFormGroup(name: string): void {
    if (!this.canAddItems) {
      return;
    }
    this.addSmartGroup.emit(name);
  }

  removeSmartFormGroup(name: string, index: number): void {
    if (!this.canRemoveItems) {
      return;
    }
    this.removeSmartGroup.emit({name, index})
  }

  getOption(control: FpcInputsInterface, index: number) {
    const alias = this.getAlias(control, index);
    return this.optionList && this.optionList[alias]
      ? this.optionList[alias].optionList
      : control.optionList;
  }

  getAlias(control: FpcInputsInterface, index: number): string {
    if (this.aliasesMatch && this.aliasesMatch.length && this.aliasesMatch[index]) {
      return this.aliasesMatch[index][control.formControlName] || control?.optionListRequestAlias;
    }
    return control?.optionListRequestAlias;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.item && !this.inited) {
      if (this.item.arrSmartOpened && this.item.edited) {
        const arr = (this.form.get(this.item.formControlName) as UntypedFormArray);
        if (arr.length < this.item.arrSmartOpened) {
          for (let i= arr.length; i<this.item.arrSmartOpened; i++) {
            this.addSmartFormGroup(this.item.formControlName);
          }
        }
      }
      this.inited = true;
    }
    if (changes.formData?.currentValue && this.item && this.form) {
      this.formData.data?.[this.item.formControlName]?.forEach((data, i) => {
        if (data['disabled']) {
          this.form?.controls[this.item.formControlName]['controls'][i].disable({emitEvent: false});
          this.disabledIndexes.add(i);
        } else {
          this.form?.controls[this.item.formControlName]['controls'][i].enable({emitEvent: false});
          this.disabledIndexes.delete(i);
        }
      });
    }
  }

  getOptionListValue(optionListName: string): OptionListItemInterface | null {
    const formControlName = this.formData?.template.find(item => item.optionListRequestAlias === optionListName).formControlName;
    const value = this.form.get(formControlName).value;
    return !value ? null : this.optionList[optionListName].optionList.find(list => list.value === value);
  }

  getDateByString(dateString: string): Date {
    const parts = dateString.split(".");
    const day = +parts[0];
    const month = +parts[1] - 1;
    const year = +parts[2];
    return new Date(year, month, day);
  }

  /**
   * Вычисляет дату на основе максимальной даты из указанных контролов внутри arr-smart элемента.
   * @param control - конфигурация поля
   * @param index - индекс элемента в массиве
   * @returns дата (максимальная + смещение) или пустая строка
   */
  getDateFromMaxOfControls(control: FpcInputsInterface, index: number): string | Date {
    if (!control.minDateFromMaxOfControls?.length) {
      return '';
    }

    const dates: Date[] = [];
    const formArray = this.form.get(this.item.formControlName) as UntypedFormArray;
    const formGroup = formArray.controls[index];

    if (!formGroup) {
      return '';
    }

    for (const controlName of control.minDateFromMaxOfControls) {
      // Сначала проверяем внутри текущей группы arr-smart
      let value = formGroup.get(controlName)?.value;

      // Если не найдено в группе, проверяем в основной форме
      if (!value) {
        value = this.form.get(controlName)?.value;
      }

      if (value) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          dates.push(date);
        }
      }
    }

    if (dates.length === 0) {
      return '';
    }

    // Находим максимальную дату
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

    // Добавляем смещение (по умолчанию 1 день)
    const offset = control.minDateOffset ?? 1;
    maxDate.setDate(maxDate.getDate() + offset);

    return maxDate;
  }

  /**
   * Получает минимальную дату для датепикера с учётом minDateFromMaxOfControls.
   * @param control - конфигурация поля
   * @param index - индекс элемента в массиве
   * @returns минимальная дата или пустая строка
   */
  getDatepickerMinForControl(control: FpcInputsInterface, index: number): string | Date {
    // Если указаны контролы для вычисления максимальной даты
    if (control.minDateFromMaxOfControls?.length) {
      return this.getDateFromMaxOfControls(control, index);
    }

    const formArray = this.form.get(this.item.formControlName) as UntypedFormArray;
    const formGroup = formArray.controls[index];

    if (control.startDateMathDay || control.startDateMathDay === 0) {
      return this.mathCurrentDateDay(
        control.startDateMathDay,
        formGroup?.get(control.minReferenceDateControl)?.value
      );
    }

    if (control.dateBeginOptionListName) {
      const optionValue = this.getOptionListValue(control.dateBeginOptionListName);
      if (optionValue?.dateBegin) {
        return this.getDateByString(optionValue.dateBegin);
      }
    }

    return '';
  }

  /**
   * Получает максимальную дату для датепикера с учётом fixedDateFromControls.
   * @param control - конфигурация поля
   * @param index - индекс элемента в массиве
   * @returns максимальная дата или пустая строка
   */
  getDatepickerMaxForControl(control: FpcInputsInterface, index: number): string | Date {
    // Если указана фиксированная дата из контролов, то max = min
    if (control.fixedDateFromControls && control.minDateFromMaxOfControls?.length) {
      return this.getDateFromMaxOfControls(control, index);
    }

    const formArray = this.form.get(this.item.formControlName) as UntypedFormArray;
    const formGroup = formArray.controls[index];

    if (control.endDateMathDay || control.endDateMathDay === 0) {
      return this.mathCurrentDateDay(
        control.endDateMathDay,
        formGroup?.get(control.maxReferenceDateControl)?.value
      );
    }

    if (control.dateEndOptionListName) {
      const optionValue = this.getOptionListValue(control.dateEndOptionListName);
      if (optionValue?.dateEnd) {
        return this.getDateByString(optionValue.dateEnd);
      }
    }

    return '';
  }
}
