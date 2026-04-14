import {
  AbstractControl,
  AsyncValidatorFn,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { FpcInputsInterface } from '../../../models/fpc.interface';

export function AsyncValidator(
  validateFn: (control: any, item: FpcInputsInterface) => Observable<any>,
  item: FpcInputsInterface,
): AsyncValidatorFn {
  return (
    control: AbstractControl
  ): Observable<any> => {
    return validateFn(control, item);
  };
}
