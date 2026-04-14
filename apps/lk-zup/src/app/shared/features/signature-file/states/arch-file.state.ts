import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FileBase64, FileType } from '../../../models/files.interface';
import { FileDownloadService } from '../../../services/file-download.service';
import { FilesService } from '../../../services/files.service';
import { FileSanitizerClass } from '../../../utilits/download-file.utils';
import { DocSignatureInterface } from '../models/doc-signature.interface';
import { FileToDownloadInterface } from '../models/file-to-download.interface';

@Injectable({
  providedIn: 'root',
})
export class ArchFileState {
  public entityName = 'archFile';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getArch,
      success: this.download,
    },
  };

  constructor(
    private fileService: FilesService,
    private fileSanitizer: FileSanitizerClass,
    private fileDownloadService: FileDownloadService
  ) {}

  getArch(data: {
    data: DocSignatureInterface;
    forEmployee: boolean;
    type: FileType;
  }): Observable<FileToDownloadInterface> {
    return (
      this.fileService.getFile(
        data.type,
        data.data.fileOwner,
        data.data.fileID,
        true,
        { forEmployee: data.forEmployee }
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

  download(file: FileToDownloadInterface): Observable<unknown> {
    return from(this.fileDownloadService.download(file.src, file.name));
  }
}
