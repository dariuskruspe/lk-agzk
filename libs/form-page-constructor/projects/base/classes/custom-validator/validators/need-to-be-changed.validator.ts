import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import {take} from "rxjs/operators";

export function NeedToBeChangedValidator(
  control: AbstractControl,
  error: ValidationErrors | null
): ValidatorFn {
  let oldValue = '';
  setTimeout(() => {
    control?.valueChanges?.pipe(take(1)).subscribe(result => {
      if (result) {
        oldValue = result;
      }
    })
  }, 0);

  return (control: AbstractControl): { [key: string]: unknown } => {
    let isEqual = false;
    if (typeof oldValue === 'string') {
      isEqual = oldValue === control.value;
    } else {
      isEqual = (oldValue as Date)?.toISOString() === control.value?.toISOString();
    }

    return isEqual ? (error ?? { error: "VALUE_REPEATS" }) : null;
  };
}
