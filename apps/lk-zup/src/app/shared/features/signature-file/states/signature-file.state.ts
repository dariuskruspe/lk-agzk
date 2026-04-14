import { Injectable } from '@angular/core';
import { DocumentInterface } from '@features/agreements/models/document.interface';
import { FileToDownloadInterface } from '@shared/features/signature-file/models/file-to-download.interface';
import { FileBase64 } from '@shared/models/files.interface';
import { FilesService } from '@shared/services/files.service';
import { FileSanitizerClass } from '@shared/utilits/download-file.utils';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SignatureFileState {
  public entityName = 'signatureFile';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getFile,
    },
  };

  constructor(
    private fileService: FilesService,
    private fileSanitizer: FileSanitizerClass
  ) {}

  getFile(doc: DocumentInterface): Observable<FileToDownloadInterface> {
    console.log(`[signature-file.state.ts]: getFile -> doc`, doc);
    return (
      this.fileService.getFile(
        'file',
        doc.fileOwner,
        doc.fileID,
        true
      ) as Observable<FileBase64>
    ).pipe(
      map((file) => ({
        name: file.fileName,
        type: file.fileExtension ?? file.fileType,
        base64: file.file64,
        uint8: this.fileSanitizer.getUint8Array(file.file64),
        src: this.fileSanitizer.getSafeResourceURLFromFileBase64Data(
          file.file64,
          file.fileExtension ?? file.fileType
        ),
      }))
    );
  }
}
