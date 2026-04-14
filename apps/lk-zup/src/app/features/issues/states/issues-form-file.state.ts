import { Injectable } from '@angular/core';
import { FileContent, FileOwners } from '@shared/models/files.interface';
import { FilesService } from '@shared/services/files.service';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IssuesFormFileState {
  public entityName = 'issuesFormFileState';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.showIssueFileBase64,
    },
    exception: {
      main: this.showIssueFileOwnerBase64,
    },
  };

  constructor(private fileService: FilesService) {}

  showIssueFileBase64(id: string): Observable<FileContent> {
    return this.fileService.getFile('file', 'issueFile', id, true);
  }

  showIssueFileOwnerBase64(data: {
    id: string;
    ownerType: FileOwners;
  }): Observable<FileContent> {
    return this.fileService.getFile('file', data.ownerType, data.id, true);
  }
}
