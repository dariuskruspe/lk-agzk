import { Component, Input, OnInit } from '@angular/core';
import { OwnerFilesViewDownloadItemFacade } from '../../facades/owner-files-view-download-item.facade';
import { OwnerFilesViewDownloadFacade } from '../../facades/owner-files-view-download.facade';
import { OwnerFilesViewDownloadListParamsInterface } from '../../models/owner-files-view-download-params.interface';
import { OwnerFilesViewDownloadListInterface } from '../../models/owner-files-view-download.interface';

@Component({
    selector: 'app-owner-files-view-download-container',
    templateUrl: './owner-files-view-download-container.component.html',
    styleUrls: ['./owner-files-view-download-container.component.scss'],
    standalone: false
})
export class OwnerFilesViewDownloadContainerComponent implements OnInit {
  @Input() ownerFileListParam: OwnerFilesViewDownloadListParamsInterface;

  @Input() dashboard: boolean;

  constructor(
    public ownerFilesViewDownloadFacade: OwnerFilesViewDownloadFacade,
    public ownerFilesViewDownloadItemFacade: OwnerFilesViewDownloadItemFacade
  ) {}

  ngOnInit(): void {
    this.ownerFilesViewDownloadFacade.getOwnerFileList(this.ownerFileListParam);
  }

  onGetFile(file: OwnerFilesViewDownloadListInterface): void {
    this.ownerFilesViewDownloadItemFacade.getOwnerFile(
      this.ownerFileListParam,
      file
    );
  }
}
