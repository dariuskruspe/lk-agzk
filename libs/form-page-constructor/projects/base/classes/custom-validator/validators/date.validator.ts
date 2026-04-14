import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function DateValidator(
  daysOff: Record<string, 'dayOff' | 'holiday' | 'workDay'>,
  value: 'dayoff' | 'workday' | number[],
  defaultError: ValidationErrors | null,
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } => {
    if (!control.value) {
      return null;
    }

    const date: Date = control.value;

    const month = `${date.getMonth() + 1}`;
    const parsedMonth = month.length === 1 ? `0${month}` : month;

    const day = `${date.getDate()}`;
    const parsedDay = day.length === 1 ? `0${day}` : day;

    const year = date.getFullYear();

    let valid = true;
    const error = {
      dateError: ''
    }
    switch (true) {
      case value === 'dayoff':
        valid = daysOff[`${year}.${parsedMonth}.${parsedDay}`] === 'holiday'
          || daysOff[`${year}.${parsedMonth}.${parsedDay}`] === 'dayOff';
        error.dateError = 'NOT_DAYOFF';
        break;
      case value === 'workday':
        valid = daysOff[`${year}.${parsedMonth}.${parsedDay}`] === 'workDay';
        error.dateError = 'NOT_WORKDAY';
        break;
      case Array.isArray(value):
        valid = (value as number[]).includes(date.getDay());
        error.dateError = 'INCORRECT_DAY';
        break;
      default:
        break;
    }

    return valid ? null : (defaultError ?? error);
  };
}
