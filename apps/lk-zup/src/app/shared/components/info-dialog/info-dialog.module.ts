import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InfoDialogComponent } from './info-dialog.component';

@NgModule({
  declarations: [InfoDialogComponent],
  imports: [CommonModule, ToolbarModule, ButtonModule],
  exports: [InfoDialogComponent],
})
export class InfoDialogModule {}
