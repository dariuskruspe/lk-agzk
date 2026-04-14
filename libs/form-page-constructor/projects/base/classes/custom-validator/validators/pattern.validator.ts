import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function PatternValidator(
  regex: RegExp,
  error: ValidationErrors,
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } => {
    const value = control.value;
    const isEmpty =
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0);
    if (isEmpty) {
      return null;
    }

    // @ts-ignore
    const valid = control.hidden || regex.test(String(value));

    return valid ? null : error;
  };
}
