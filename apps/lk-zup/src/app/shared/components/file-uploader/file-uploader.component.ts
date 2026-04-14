import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FpcInputsInterface } from '@wafpc/base/models/fpc.interface';
import { FileSelectEvent } from 'primeng/fileupload';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  standalone: false,
})
export class FileUploaderComponent {
  fileNames: string[];

  @Input() controlName: string;

  @Input() template: FpcInputsInterface[];

  @Input() form: FormGroup;

  @Input() label = '';

  @Input() types: string;

  @Input() multi = false;

  @Input() hint = '';

  fileProcessing(
    formControlName: string,
    fileDescription: string,
    event: FileSelectEvent,
    loadType: string = 'base64',
  ): void {
    this.fileNames = [];
    const getBase64 = (f: Blob | File): Promise<string | ArrayBuffer> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(f);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    switch (loadType) {
      case 'base64':
      default: {
        const formControlValue = [];
        for (let i = 0; i < event.files.length; i += 1) {
          const file = event.files[i];
          getBase64(file).then((file64) => {
            const valObj = {};
            const fileName = file.name;
            const fileObj = { fileName, file64, fileDescription };
            formControlValue.push(fileObj);
            valObj[formControlName] = formControlValue;
            this.form.patchValue(valObj);
          });
        }
        break;
      }
    }
  }

  clear(formControlName: string): void {
    const valObj = {
      [formControlName]: [],
    };
    this.form.patchValue(valObj);
  }

  getKeys(obj: unknown): string[] {
    return Object.keys(obj);
  }

  get errorMessage(): string {
    let error;
    this.template.forEach((control) => {
      if (control.formControlName === 'files' && control.validations?.length) {
        error = control;
      }
    });
    return error?.errorMessage;
  }
}
