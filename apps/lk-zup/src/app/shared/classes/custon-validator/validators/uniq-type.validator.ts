import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function UniqTypeValidator(error: ValidationErrors): ValidatorFn {
  return (formArray: AbstractControl): { [key: string]: unknown } => {
    if (!formArray.value) {
      return null;
    }

    if (formArray instanceof FormArray) {
      const duplicatedTypeIds = [];
      formArray.controls.reduce((uniq: string[], group: FormGroup) => {
        if (!uniq.includes(group.value.contactTypeID)) {
          uniq.push(group.value.contactTypeID);
        } else {
          duplicatedTypeIds.push(group.value.contactTypeID);
        }
        return uniq;
      }, []);

      formArray.controls.forEach((group: FormGroup) => {
        if (duplicatedTypeIds.includes(group.value.contactTypeID)) {
          group.controls.contactTypeID.setErrors(error);
        } else {
          group.controls.contactTypeID.setErrors(
            group.value.contactTypeID ? null : {}
          );
        }
      });

      return duplicatedTypeIds.length ? error : null;
    }

    return null;
  };
}
