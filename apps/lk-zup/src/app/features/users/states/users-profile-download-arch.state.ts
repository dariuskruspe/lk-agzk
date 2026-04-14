import { Injectable } from '@angular/core';
import { FileToDownloadInterface } from '@shared/features/signature-file/models/file-to-download.interface';
import { FileBase64 } from '@shared/models/files.interface';
import { FileDownloadService } from '@shared/services/file-download.service';
import { FileSanitizerClass } from '@shared/utilits/download-file.utils';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmployeesService } from '../../employees/services/employees.service';

@Injectable({
  providedIn: 'root',
})
export class UsersProfileDownloadArchState {
  public entityName = 'usersProfileDownloadArch';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getIssuesArchFile,
      success: this.download,
    },
  };

  constructor(
    private employeesPersonalDataService: EmployeesService,
    private fileSanitizer: FileSanitizerClass,
    private fileDownload: FileDownloadService
  ) {}

  getIssuesArchFile(fileId: string): Observable<FileToDownloadInterface> {
    return (
      this.employeesPersonalDataService.getArchFile(
        fileId
      ) as Observable<FileBase64>
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
