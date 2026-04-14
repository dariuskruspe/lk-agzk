import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';

export class FormUtils {
  static touchForm(form: FormGroup) {
    for (const item in form.controls) {
      const control = form.get(item)!;

      if (control instanceof FormGroup) {
        FormUtils.touchForm(control);
      } else if (control instanceof FormArray) {
        for (const item of control.controls) {
          if (item instanceof FormGroup) {
            FormUtils.touchForm(item);
          } else {
            this.touchControl(item);
          }
        }
      } else {
        this.touchControl(control);
      }
    }
  }

  static touchControl(control: AbstractControl) {
    control.markAsTouched();
    control.updateValueAndValidity();
    control.markAsDirty();
  }
}
