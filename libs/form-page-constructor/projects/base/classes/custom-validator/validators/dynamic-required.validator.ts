import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function DynamicRequiredValidator(
  error: ValidationErrors
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } => {
    const hasValue = Array.isArray(control.value) ? !!control.value.length : control.value;
    if (hasValue) {
      return null;
    }
    // @ts-ignore
    const valid = control.hidden || (!control.hidden && hasValue);
    return valid ? null : error;
  };
}
