import { Injectable, Optional } from '@angular/core';
import {
  AsyncValidatorFn,
  UntypedFormArray,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CustomValidator } from '../classes/custom-validator/custom-validator';
import { VacationValidateService } from '../classes/custom-validator/services/vacation-validate.service';
import { FpcInputsInterface, ValidationTypes } from '../models/fpc.interface';
import { DaysOffService } from '../services/days-off.service';

@Injectable()
export class ValidatorsUtils {
  constructor(
    @Optional() private vacationValidateService: VacationValidateService,
    @Optional() private daysOffService: DaysOffService,
  ) {}

  getList(
    item: FpcInputsInterface,
    form?: UntypedFormGroup | UntypedFormArray,
  ): ValidatorFn[] {
    const validators = item.validations ?? [];
    const validatorArr: ValidatorFn[] = [];
    for (const name of validators) {
      if (this.getValidator(name, form, item)) {
        validatorArr.push(this.getValidator(name, form, item));
      }
    }
    return validatorArr;
  }

  getAsyncList(item: FpcInputsInterface): AsyncValidatorFn[] {
    const validatorArr: AsyncValidatorFn[] = [];
    const validators = item.validations ?? [];
    for (const name of validators) {
      if (this.getAsyncValidator(name, item)) {
        validatorArr.push(this.getAsyncValidator(name, item));
      }
    }
    return validatorArr;
  }

  private getValidator(
    validator: unknown,
    form: UntypedFormGroup | UntypedFormArray,
    item?: FpcInputsInterface,
  ): ValidatorFn {
    const controlName = item?.formControlName;
    console.log('validator', validator, controlName);
    if (typeof validator === 'string') {
      const error = { [validator]: item.errorMessages?.[validator] ?? true };
      switch (validator) {
        case 'required':
          return Validators.required;
        case 'dynamic-required':
          return CustomValidator.dynamicRequiredValidator({
            required: item.errorMessages?.[validator] ?? true,
          });
        case 'email':
          return Validators.email;
        case 'uniq':
          return CustomValidator.uniqTypeValidator(error);
        case 'needToBeChanged':
          return CustomValidator.needToBeChangedValidator(
            form.get(controlName),
            item.errorMessages?.[validator] ? error : null,
          );
        default:
          break;
      }
    }
    if (typeof validator === 'object') {
      const name = Object.keys(validator)[0];
      const error = { [name]: item.errorMessages?.[name] ?? true };
      switch (name) {
        case 'pattern':
          // return Validators.pattern(validator[name]);
          return CustomValidator.dynamicPatternValidator(
            validator[name] as string,
            error,
          );
        case 'min':
          return Validators.min(validator[name]);
        case 'max':
          return Validators.max(validator[name]);
        case 'minLength':
          return Validators.minLength(validator[name]);
        case 'maxLength':
          return Validators.maxLength(validator[name]);
        case 'filesType':
          return CustomValidator.filesTypeValidator(validator[name], error);
        case 'notEqual':
          return CustomValidator.NotEqualValidator(
            form.get(validator[name]),
            item.errorMessages?.[name] ? error : null,
          );
        case 'date':
          return CustomValidator.dateValidator(
            validator[name],
            this.daysOffService?.daysOff,
            item.errorMessages?.[name] ? error : null,
          );
        case 'syncWorkSchedule':
          return CustomValidator.dateValidator(
            validator[name],
            this.daysOffService?.schedule,
            item.errorMessages?.[name] ? error : null,
          );
        case 'periodsGap':
          return CustomValidator.periodGapValidator(
            validator[name],
            this.daysOffService?.daysOff,
            error,
          );
        default:
          break;
      }
    }
    return null;
  }

  private getAsyncValidator(
    validator: unknown,
    item: FpcInputsInterface,
  ): AsyncValidatorFn | null {
    if (typeof validator === 'string') {
      switch (validator) {
        case 'vacation':
          return CustomValidator.vacationValidator(
            this.vacationValidateService?.isPeriodValid.bind(
              this.vacationValidateService,
            ),
            {
              invalidPeriod: 'NOT_ALLOWED_PERIOD',
            },
          );
        default:
          break;
      }
    }
    //    if (typeof validator === 'object') {
    //      const key = Object.keys(validator)[0];
    //      switch (key) {
    //        case 'workSchedule':
    //          if (!this.asyncValidators?.getValidator(key)) {
    //            return null;
    //          }
    //          return CustomValidator.asyncValidator(
    //            this.asyncValidators.getValidator(key),
    //            item,
    //          );
    //        default:
    //          break;
    //      }
    //    }
    return null;
  }
}
