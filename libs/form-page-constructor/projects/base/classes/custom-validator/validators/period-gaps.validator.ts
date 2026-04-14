import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  UntypedFormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { DaysOffInterface } from '../../../models/fpc.interface';
import m from 'moment';
import { getOffsetDate } from '../../../utils/math-days-offset.util';
import { DaysType } from '../../../models/fpc.interface';

export function PeriodGapsValidator(
  params: {
    gap?: number,
    exclude?: DaysType[],
    less?: boolean,
    end: string,
  },
  daysOff: DaysOffInterface,
  error: ValidationErrors
): ValidatorFn {
  return (
    controlStart: AbstractControl
  ): { [key: string]: unknown } | null => {
    if (!controlStart.value || controlStart.parent?.pristine) {
      return null;
    }

    const gap = params?.gap ?? 1;
    const excluded = params?.exclude ?? [];
    const allowedLessGap = !!params?.less;

    const arr = controlStart.parent?.parent as FormArray;
    const index = arr?.controls.findIndex((v) => {
      return v === controlStart.parent
    });
    if (index <= 0) {
      return null;
    }

    const prevGroup = arr.controls[index - 1];
    if (!prevGroup) {
      return null;
    }

    const prevEnd = prevGroup.get(params?.end)?.value;
    const offsetDate = getOffsetDate({
      value: {
        type: 'day',
        count: gap,
        excluded
      },
      reference: prevEnd,
      daysOff,
    });

    if (
      (m(offsetDate).diff(m(controlStart?.value), 'days') === 0 && !allowedLessGap)
      || (allowedLessGap && m(offsetDate).diff(m(controlStart?.value), 'days') <= gap)
    ) {
      return null;
    }

    return error;
  };
}

