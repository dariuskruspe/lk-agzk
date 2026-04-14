export interface OwnerFilesViewDownloadListParamsInterface {
  ownerType: string;
  ownerId: string;
}

export interface OwnerFilesViewDownloadItemParamsInterface {
  ownerType?: string;
  ownerId?: string;
  fileID?: string;
  fileType?: string;
  reqScript?: string;
}
