import { Component, ElementRef, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../base/components/fpc-components/base-component/base.component';

@Component({
    selector: 'fpc-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss'],
    standalone: false
})
export class FileUploaderComponent extends BaseComponent implements OnChanges {
  @ViewChild('uploader') uploaderRef: ElementRef

  files: {fileName: string}[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.item?.currentValue?.formControlName && changes.form?.currentValue) {
      this.setFiles();
    }
  }

  select(): void {
    this.uploaderRef.nativeElement.click();
  }

  removeFiles(index?: number): void {
    if (typeof index === 'number') {
      this.files.splice(index, 1);
    } else {
      this.files = [];
    }

    if (this.uploaderRef?.nativeElement) {
      this.uploaderRef.nativeElement.value = null;
    }

    this.form.patchValue({
      [this.item.formControlName]: this.files,
    });
  }

  setFiles() {
    const value = this.form.get(this.item.formControlName).value;
    if (value && value.length) {
      this.files = [ ...value ];
    } else {
      this.removeFiles();
    }
  }

  getKeys(obj: unknown): string[] {
    return Object.keys(obj);
  }

  async onFilesAdd(event: any) {
    const selectedFiles = event.target?.files;
    const files = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const file64 = await this.getBase64(file);
      files.push({
        fileName: file.name,
        file64
      });
    }

    this.files = [...this.files, ...files];

    this.form.patchValue({
      [this.item.formControlName]: this.files,
    });
  }

  private async getBase64(f: Blob | File): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
}
