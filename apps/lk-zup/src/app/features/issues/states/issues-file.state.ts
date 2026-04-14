import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { FileBase64 } from '../../../shared/models/files.interface';
import { FilesService } from '../../../shared/services/files.service';

@Injectable({
  providedIn: 'root',
})
export class IssuesFileState {
  public entityName = 'issuesFile';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.showIssueFileBase64,
    },
    exception: {
      main: this.showIssueBase64,
    },
  };

  constructor(private fileService: FilesService) {}

  showIssueFileBase64(id: string): Observable<FileBase64 | string | Blob> {
    return this.fileService.getFile('file', 'issueFile', id, true);
  }

  showIssueBase64(id: string): Observable<FileBase64 | string | Blob> {
    return this.fileService.getFile('file', 'issue', id, true);
  }
}
