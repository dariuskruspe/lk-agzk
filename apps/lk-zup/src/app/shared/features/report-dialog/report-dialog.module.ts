import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToolbarModule } from 'primeng/toolbar';
import { PdfViewerModule } from '../../components/pdf-viewer/pdf-viewer.module';
import { LangModule } from '../lang/lang.module';
import { ReportDialogComponent } from './components/report-dialog/report-dialog.component';
import { ReportDialogContainerComponent } from './containers/report-dialog-container/report-dialog-container.component';
import { SplitButtonModule } from 'primeng/splitbutton';

@NgModule({
  declarations: [ReportDialogContainerComponent, ReportDialogComponent],
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    PdfViewerModule,
    ToolbarModule,
    LangModule,
    ButtonModule,
    MatIconModule,
    SplitButtonModule,
  ],
  exports: [ReportDialogContainerComponent],
})
export class ReportDialogModule {}
