import { inject, Injectable, WritableSignal } from '@angular/core';
import {
  DocumentInterface,
  GetDocumentParamsInterface,
} from '@features/agreements/models/document.interface';
import { DocumentApiService } from '@features/agreements/services/document-api.service';
import { FileDataInterface } from '@shared/interfaces/file/file-data.interface';
import { UserStorageInterface } from '@shared/interfaces/storage/user/user-storage.interface';
import { AppService } from '@shared/services/app.service';
import { FilesService } from '@shared/services/files.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  app: AppService = inject(AppService);

  currentUserStorage: UserStorageInterface = this.app.storage.user.current;

  isDocumentLoadingSignal: WritableSignal<boolean> =
    this.currentUserStorage.data.frontend.signal.isDocumentLoading;

  isDocumentFileLoadingSignal: WritableSignal<boolean> =
    this.currentUserStorage.data.frontend.signal.isDocumentFileLoading;

  openDocumentSignal: WritableSignal<DocumentInterface> =
    this.currentUserStorage.data.frontend.signal.openDocument;

  openDocumentFileUint8ArraySignal: WritableSignal<Uint8Array> =
    this.currentUserStorage.data.frontend.signal.openDocumentFileUint8Array;

  openDocumentFileDataSignal: WritableSignal<FileDataInterface> =
    this.currentUserStorage.data.frontend.signal.openDocumentFileData;

  lastOpenDocumentSignal: WritableSignal<DocumentInterface> =
    this.currentUserStorage.data.frontend.signal.lastOpenDocument;

  constructor(
    // API
    private documentAPI: DocumentApiService,

    // Other
    private fileService: FilesService,
  ) {}

  async getDocumentHandler(params: GetDocumentParamsInterface): Promise<void> {
    if (!params) return;

    this.isDocumentLoadingSignal.set(true);

    let doc: DocumentInterface;

    try {
      doc = await firstValueFrom(this.documentAPI.getDocument(params));
    } finally {
      this.isDocumentLoadingSignal.set(false);
    }

    if (!doc) return;

    this.openDocumentSignal.set(doc);
    this.lastOpenDocumentSignal.set(doc);
  }

  async getDocumentFileHandler(
    doc: DocumentInterface = this.openDocumentSignal(),
  ): Promise<void> {
    if (!doc) return;

    this.isDocumentFileLoadingSignal.set(true);

    // document file binary data

    let docFileBlob: Blob;

    try {
      docFileBlob = await firstValueFrom(
        this.fileService.getFileBlob('file', doc.fileOwner, doc.fileID),
      );
    } finally {
      this.isDocumentFileLoadingSignal.set(false);
    }

    if (!docFileBlob) return;

    const docFileUint8Array: Uint8Array = new Uint8Array(
      await docFileBlob.arrayBuffer(),
    );

    const docFileData: FileDataInterface = {
      content: {
        uint8Array: docFileUint8Array,
      },
      mimeType: docFileBlob.type,
    };
    this.openDocumentFileDataSignal.set(docFileData);
    this.openDocumentFileUint8ArraySignal.set(docFileUint8Array);
  }
}
