import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function hasDifferenceValidator(
  matchControl: AbstractControl,
  error: ValidationErrors
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } => {
    if (!control.value) {
      return null;
    }
    const valid = matchControl.value !== control.value;
    return valid ? null : error;
  };
}
