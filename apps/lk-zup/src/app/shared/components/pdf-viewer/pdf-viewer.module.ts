import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { LangModule } from '../../features/lang/lang.module';
import { PdfViewerComponent } from './pdf-viewer.component';

@NgModule({
  declarations: [PdfViewerComponent],
  imports: [CommonModule, LangModule, ButtonModule],
  exports: [PdfViewerComponent],
})
export class PdfViewerModule {}
