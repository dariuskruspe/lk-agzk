import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FileToDownloadInterface } from '../../../shared/features/signature-file/models/file-to-download.interface';
import { FileBase64 } from '../../../shared/models/files.interface';
import { FileDownloadService } from '../../../shared/services/file-download.service';
import { FilesService } from '../../../shared/services/files.service';
import { FileSanitizerClass } from '../../../shared/utilits/download-file.utils';
import { IssuesArchService } from '../services/issues-arch.service';

@Injectable({
  providedIn: 'root',
})
export class IssuesArchState {
  public entityName = 'issuesArchState';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getIssuesArchAll,
      success: this.download,
    },
  };

  constructor(
    private issuesArchService: IssuesArchService,
    private filesService: FilesService,
    private fileSanitizer: FileSanitizerClass,
    private fileDownload: FileDownloadService
  ) {}

  getIssuesArchAll(issueId: string): Observable<FileToDownloadInterface> {
    return (
      this.issuesArchService.getIssueArch(issueId) as Observable<FileBase64>
    ).pipe(
      map((file) => ({
        name: file.fileName,
        type: file.fileExtension ?? file.fileType,
        base64: file.file64,
        src: this.fileSanitizer.getSafeResourceURLFromFileBase64Data(
          file.file64,
          file.fileExtension ?? file.fileType
        ),
      }))
    );
  }

  download(result: FileToDownloadInterface): Observable<unknown> {
    return of(this.fileDownload.download(result.src, result.name));
  }
}
