import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function FilesTypeValidator(
  types: string,
  error: ValidationErrors
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } => {
    if (!control.value) {
      return null;
    }

    const validExtension = types.split(',').map((e) => e.trim());
    for (const file of control.value) {
      const nameSplit = file.fileName.split('.');
      const extensionFile = nameSplit[nameSplit.length - 1];
      if (
        !validExtension.find((e) => e === `.${extensionFile.toLowerCase()}`)
      ) {
        return error;
      }
    }
    return null;
  };
}
