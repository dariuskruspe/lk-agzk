import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  ValidationErrors,
} from '@angular/forms';
import moment from 'moment';

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
      startDate: FormControl;
      endDate: FormControl;
    };

    if (
      controls.startDate.value &&
      controls.endDate.value &&
      moment(controls.startDate.value)?.isValid() &&
      moment(controls.endDate.value)?.isValid() &&
      new Date(controls.startDate.value) < new Date(controls.endDate.value)
    ) {
      const startDate = moment(controls.startDate.value).toISOString();
      const endDate = moment(controls.endDate.value).toISOString();
      try {
        await validateFn({ startDate, endDate });
        return null;
      } catch (e) {
        return error;
      }
    }
    return null;
  };
}
