import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { LangModule } from '../../features/lang/lang.module';
import { FileUploaderComponent } from './file-uploader.component';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    FileUploadModule,
    LangModule,
  ],
  declarations: [FileUploaderComponent],
  exports: [FileUploaderComponent],
})
export class FileUploaderModule {}
