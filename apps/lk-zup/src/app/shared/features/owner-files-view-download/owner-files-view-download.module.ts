import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FpcModule } from '../fpc/fpc.module';
import { OwnerFilesViewDownloadComponent } from './components/owner-files-view-download/owner-files-view-download.component';
import { OwnerFilesViewDownloadContainerComponent } from './containers/owner-files-view-download-container/owner-files-view-download-container.component';

@NgModule({
  declarations: [
    OwnerFilesViewDownloadContainerComponent,
    OwnerFilesViewDownloadComponent,
  ],
  imports: [CommonModule, FpcModule],
  exports: [OwnerFilesViewDownloadContainerComponent],
})
export class OwnerFilesViewDownloadModule {}
