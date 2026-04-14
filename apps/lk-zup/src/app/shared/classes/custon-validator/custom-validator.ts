import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { AntiPatternValidator } from './validators/anti-pattern.validator';
import { FilesTypeValidator } from './validators/files-type.validator';
import { hasDifferenceValidator } from './validators/has-difference.validator';
import { MatchValidator } from './validators/match.validator';
import { PatternValidator } from './validators/pannern.validator';
import { UniqTypeValidator } from './validators/uniq-type.validator';
import { VacationValidator } from './validators/vacation.validator';

export class CustomValidator {
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return PatternValidator(regex, error);
  }

  static antiPatternValidator(
    regex: RegExp,
    error: ValidationErrors
  ): ValidatorFn {
    return AntiPatternValidator(regex, error);
  }

  static matchValidator(
    matchControl: AbstractControl,
    error: ValidationErrors
  ): ValidatorFn {
    return MatchValidator(matchControl, error);
  }

  static hasDifferenceValidator(
    matchControl: AbstractControl,
    error: ValidationErrors
  ): ValidatorFn {
    return hasDifferenceValidator(matchControl, error);
  }

  static filesTypeValidator(
    types: string,
    error: ValidationErrors
  ): ValidatorFn {
    return FilesTypeValidator(types, error);
  }

  static uniqTypeValidator(error: ValidationErrors): ValidatorFn {
    return UniqTypeValidator(error);
  }

  static vacationValidator(
    fn: (params) => Promise<void>,
    error: ValidationErrors
  ): AsyncValidatorFn {
    return VacationValidator(fn, error);
  }
}
