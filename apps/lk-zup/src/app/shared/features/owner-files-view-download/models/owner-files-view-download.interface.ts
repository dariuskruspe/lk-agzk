export interface OwnerFilesViewDownloadListInterface {
  fileID: string;
  fileName: string;
  fileType: 'doc' | 'sign' | 'arch' | 'img';
  reqScript: 'doc-orig' | 'doc-sign' | 'arch' | 'sign';
}

export interface OwnerFilesViewDownloadItemInterface {
  fileName: string;
  fileExtension: string;
  file64: string;
}
