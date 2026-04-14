import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

export function isFormGroupOrArray(
  obj: AbstractControl
): obj is FormArray | FormGroup {
  if ('controls' in obj) {
    return true;
  }
  return false;
}
export function markAsTouched(group: FormGroup | FormArray): void {
  const controls = Array.isArray(group.controls)
    ? group.controls
    : Object.values(group.controls);
  for (const control of controls) {
    control.markAsDirty();
    control.markAsTouched();
    control.updateValueAndValidity();

    if (isFormGroupOrArray(control)) {
      markAsTouched(control);
    }
  }
}
