import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { AntiPatternValidator } from './validators/anti-pattern.validator';
import { DateValidator } from './validators/date.validator';
import { DynamicRequiredValidator } from './validators/dynamic-required.validator';
import { FilesTypeValidator } from './validators/files-type.validator';
import { MatchValidator } from './validators/match.validator';
import { NotEqualValidator } from './validators/not-equal.validator';
import { PatternValidator } from './validators/pattern.validator';
import { UniqTypeValidator } from './validators/uniq-type.validator';
import { VacationValidator } from './validators/vacation.validator';
import { NeedToBeChangedValidator } from "./validators/need-to-be-changed.validator";
import { DaysOffInterface, DaysType, FpcInputsInterface } from '../../models/fpc.interface';
import { AsyncValidator } from './validators/async.validator';
import { Observable } from 'rxjs';
import { PeriodGapsValidator } from './validators/period-gaps.validator';

export class CustomValidator {
  static filesTypeValidator(
    types: string,
    error: ValidationErrors
  ): ValidatorFn {
    return FilesTypeValidator(types, error);
  }

  static uniqTypeValidator(error: ValidationErrors): ValidatorFn {
    return UniqTypeValidator(error);
  }

  static dynamicRequiredValidator(error: ValidationErrors): ValidatorFn {
    return DynamicRequiredValidator(error);
  }

  static dynamicPatternValidator(regex: string, error: ValidationErrors): ValidatorFn {
    const reqExpression = new RegExp(regex);
    return PatternValidator(reqExpression, error);
  }

  static dateValidator(
    value: 'dayoff' | 'workday' | number[],
    daysOff: Record<string, 'dayOff' | 'holiday' | 'workDay'>,
    error: ValidationErrors | null
  ): ValidatorFn {
    return DateValidator(daysOff, value, error);
  }

  static vacationValidator(
    fn: (params: unknown) => Promise<void>,
    error: ValidationErrors
  ): AsyncValidatorFn {
    return VacationValidator(fn, error);
  }

  static asyncValidator(
    fn: (control: unknown, item: FpcInputsInterface) => Observable<any>,
    item: FpcInputsInterface,
  ): AsyncValidatorFn {
    return AsyncValidator(fn, item);
  }

  static periodGapValidator(
    params: {
      gap?: number,
      exclude?: DaysType[],
      less?: boolean,
      end: string,
    },
    daysOff: DaysOffInterface,
    error: ValidationErrors,
  ): ValidatorFn {
    return PeriodGapsValidator(params, daysOff, error);
  }

  static NotEqualValidator(
    control: AbstractControl,
    error: ValidationErrors
  ): ValidatorFn {
    return NotEqualValidator(control, error);
  }

  static needToBeChangedValidator(
    control: AbstractControl,
    error: ValidationErrors
  ): ValidatorFn {
    return NeedToBeChangedValidator(control, error);
  }
}
