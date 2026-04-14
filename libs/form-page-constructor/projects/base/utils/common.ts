import { FpcInputsInterface } from "../models/fpc.interface";

/**
 * Получаем значение по умолчанию для элемента управления по его типу.
 *
 * @param controlType тип элемента управления (поле type в FpcInputsInterface)
 */
export function getDefaultControlValue(controlType: FpcInputsInterface['type']) {
  if (controlType === 'checkbox') return false;
  if (controlType === 'number') return 0;
  return '';
}

/**
 * Проверяем, является ли control (элемент управления) datepicker'оподобным, таким как 'datepicker',
 * 'datepicker-month', 'datepicker-year', 'datepicker-range-start' , 'datepicker-range-end'
 *
 * @param controlType тип элемента управления (поле type в FpcInputsInterface)
 */
export function isDatepickerLike(controlType: FpcInputsInterface['type']): boolean {
  return controlType?.startsWith('datepicker') || false;
}

export function getDefaultPresetValue(value: string | boolean | string[] | number, staticData: Record<string, string | boolean | string[] | number>, staticDataManager: Record<string, string | boolean | string[] | number>): string | boolean | string[] | number {
  if (typeof value === 'string' && value.includes('staticd') && staticData) {
    const staticd = {...staticData};
    const staticdm = {...(staticDataManager ?? {})};

    if (value.startsWith('$')) {
      return eval(`"use strict"; value`);
    } else {
      return eval(`"use strict"; ${value}`);
    }
  } else {
    return value;
  }
}
