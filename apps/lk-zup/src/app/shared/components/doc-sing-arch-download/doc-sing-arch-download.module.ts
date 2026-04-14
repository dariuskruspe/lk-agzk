import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DocSingArchDownloadComponent } from './doc-sing-arch-download/doc-sing-arch-download.component';

@NgModule({
  declarations: [DocSingArchDownloadComponent],
  exports: [DocSingArchDownloadComponent],
  imports: [CommonModule, MatIconModule, RouterModule],
})
export class DocSingArchDownloadModule {}
