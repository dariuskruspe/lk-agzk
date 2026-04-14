import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function NotEqualValidator(
  targetControl: AbstractControl,
  error: ValidationErrors | null
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } => {
    if (!control.value) {
      return null;
    }

    let valid = true;
    if (typeof control.value === 'string') {
      valid = targetControl?.value !== control.value;
    } else {
      valid = targetControl?.value?.toISOString() !== control.value?.toISOString();
    }

    return valid ? null : (error ?? { error: "VALUE_REPEATS" });
  };
}
