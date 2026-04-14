import {
  AbstractControl,
  AsyncValidatorFn,
  UntypedFormControl,
  ValidationErrors,
} from '@angular/forms';
import m from 'moment';

export function VacationValidator(
  validateFn: (params) => Promise<void>,
  error: ValidationErrors
): AsyncValidatorFn {
  return async (
    control: AbstractControl
  ): Promise<{ [key: string]: unknown } | null> => {
    if (!control.value || control.parent?.pristine) {
      return null;
    }

    const controls = control.parent?.controls as {
      startDate: UntypedFormControl;
      endDate: UntypedFormControl;
    };

    if (
      controls.startDate.value &&
      controls.endDate.value &&
      m(controls.startDate.value)?.isValid() &&
      m(controls.endDate.value)?.isValid() &&
      new Date(controls.startDate.value) < new Date(controls.endDate.value)
    ) {
      const startDate = m(controls.startDate.value).toISOString();
      const endDate = m(controls.endDate.value).toISOString();
      try {
        await validateFn({ startDate, endDate });
      } catch (e) {
        return error;
      }
    }
    return null;
  };
}
