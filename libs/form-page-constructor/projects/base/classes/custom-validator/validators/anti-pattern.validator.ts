import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function AntiPatternValidator(
  regex: RegExp,
  error: ValidationErrors
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } => {
    if (!control.value) {
      return null;
    }

    const valid = regex.test(control.value);

    return !valid ? null : error;
  };
}
